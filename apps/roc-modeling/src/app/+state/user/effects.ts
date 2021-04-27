import { Injectable } from '@angular/core';
import { NavigationService } from '@app/core/services';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '@env/environment';
import { SaveUserProfileGQL, Tenant, UserByIdGQL, UserProfile, UserProfileInput } from '@gql';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { UseCaseError } from '@vantage-point/ddd-core';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { selectTenant } from '../tenant/selectors';
import { TenantService } from '../tenant/tenant.service';
import { loginErrorHappened, requestLogin, requestLogout, requestUserAfterAuthentication, saveUserProfileAfterOnBoarding, setActiveUser, setHighSchool, setRoles, setUserName, setUserType } from './actions';
import { getUserProfile } from './selectors';
import { Roles } from './state';


@Injectable()
export class UserEffects
{

  constructor
    (
      private store: Store,
      private actions$: Actions,
      private authService: AuthService,
      private saveUserProfileGQL: SaveUserProfileGQL,
      private userByIdGQL: UserByIdGQL,
      private navigationService: NavigationService,
      private notificationService: NotificationService,
      private tenantService: TenantService
    )
  {
  }

  requestUserAfterAuthentication$ = createEffect(() => this.actions$.pipe
    (
      ofType(requestUserAfterAuthentication),
      switchMap(() => this.authService.user$),
      switchMap((user) =>
      {
        // console.log('RAW AUTH USER', user);

        return forkJoin
          (
            [
              of(user),
              this.userByIdGQL.fetch({ id: user.sub }),
              this.tenantService.getTenantFromDomain()
            ]
          );
      }),
      switchMap((results) =>
      {
        const authenticatedUser: any = results[0];
        const userProfileFromDataStore: UserProfile = results[1].data.userById;
        const tenant: Tenant = results[2].data.tenantByHostName;

        // console.log('authenticatedUser', authenticatedUser);
        // console.log('userProfile from data store', userProfileFromDataStore);
        // console.log('tenant', tenant);

        const userProfileInput: UserProfileInput =
        {
          tenantId: tenant.id,
          id: authenticatedUser['sub'] ?? null,
          emailAddress: authenticatedUser['email'] ?? null,
          firstName: userProfileFromDataStore?.firstName ?? null,
          lastName: userProfileFromDataStore?.lastName ?? null,
          userType: userProfileFromDataStore?.userType ?? null,
          highSchoolId: userProfileFromDataStore?.highSchoolId ?? null,
          hasCompletedOnboarding: userProfileFromDataStore?.hasCompletedOnboarding ?? false,
        };

        const authRoles: any[] = authenticatedUser["https://returnon.college/roles"] ?? [];
        // const assignedTenantHost: string = authenticatedUser["https://returnon.college/tenants"] ?? 'UNKNOWN';

        const roles: Roles =
        {
          isUser: authRoles.includes("user") ?? false,
          isManager: authRoles.includes("manager") ?? false,
          isAdmin: authRoles.includes("admin") ?? false
        };

        // console.log('YO: application tenant: ', tenant.hostName);
        // console.log('YO: authenticated users assigned tenant: ', assignedTenantHost);
        // console.log('userProfileInput', userProfileInput);
        // console.log('roles', roles);
        // console.log('---------------------------------------------------------------------------');

        return this.saveUserProfileGQL
          .mutate({ userProfileInput })
          .pipe
          (
            switchMap(apolloMutationResults =>
            {
              const userProfile: UserProfile = apolloMutationResults.data.saveUserProfile;

              return [
                setActiveUser({ userProfile }),
                setRoles({ roles })
              ];
            })
          );
      }),
      catchError((errorMessage) =>
      {
        const useCaseError: UseCaseError =
        {
          message: errorMessage,
          error: null,
          errorType: 'REQUEST AUTHENTICATED USER',
          details: null
        };

        return of(loginErrorHappened({ useCaseError }));
      })
    )
  );



  setActiveUser$ = createEffect(() => this.actions$.pipe
    (
      ofType(setActiveUser),
      map((action) =>
      {
        if (action.userProfile.hasCompletedOnboarding)
        {
          this.navigationService.goToModelingPage();
        }
        else
        {
          this.navigationService.goToOnBoardingPage();
        }
      })
    ), { dispatch: false }
  );

  setUserName$ = createEffect(() => this.actions$.pipe
    (
      ofType(setUserName),
      map(() =>
      {
        this.navigationService.goToOnBoardingUserTypePage();
      })
    ), { dispatch: false }
  );

  // setUserType$ = createEffect(() => this.actions$.pipe
  //   (
  //     ofType(setUserType),
  //     map(() =>
  //     {
  //       this.navigationService.goToOnBoardingHighSchoolPage();
  //     })
  //   ), { dispatch: false }
  // );

  setUserType$ = createEffect(() => this.actions$.pipe
    (
      ofType(setUserType),
      map(() => saveUserProfileAfterOnBoarding())
    ));

  setHighSchool$ = createEffect(() => this.actions$.pipe
    (
      ofType(setHighSchool),
      map(() => saveUserProfileAfterOnBoarding())
    ));

  saveUserProfileAfterOnBoarding$ = createEffect(() => this.actions$.pipe
    (
      ofType(saveUserProfileAfterOnBoarding),
      withLatestFrom
        (
          this.store.pipe(select(selectTenant)),
          this.store.pipe(select(getUserProfile))
        ),
      switchMap(([_action, tenant, userProfile]) =>
      {
        const userProfileInput: UserProfileInput =
        {
          tenantId: tenant.id,
          id: userProfile.id,
          emailAddress: userProfile.emailAddress,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          userType: userProfile.userType,
          highSchoolId: userProfile.highSchoolId,
          hasCompletedOnboarding: true,
        };

        return this.saveUserProfileGQL
          .mutate({ userProfileInput })
          .pipe
          (
            map(apolloMutationResults =>
            {
              const userProfile: UserProfile = apolloMutationResults.data.saveUserProfile;

              return setActiveUser({ userProfile });
            })
          );
      }),
      catchError((errorMessage) =>
      {
        const useCaseError: UseCaseError =
        {
          message: errorMessage,
          error: null,
          errorType: 'SAVE USER PROFILE AFTER ON-BOARDING',
          details: null
        };

        return of(loginErrorHappened({ useCaseError }));
      })
    ));



  loginErrorHappened$ = createEffect(() => this.actions$.pipe
    (
      ofType(loginErrorHappened),
      switchMap((action) => this.notificationService.error(action.useCaseError).afterDismissed()),
      map(() => requestLogout())
    ));



  requestLogin$ = createEffect(() => this.actions$.pipe
    (
      ofType(requestLogin),
      map(() =>
      {
        const returnUrl = `${document.location.origin}/authorized`;

        this.authService.loginWithRedirect(
          {
            redirect_uri: returnUrl,
            client_id: environment.auth.clientId,
            tenantHost: document.location.host
          });
      })
    ), { dispatch: false }
  );

  requestLogout$ = createEffect(() => this.actions$.pipe
    (
      ofType(requestLogout),
      map(() =>
      {
        const returnUrl = `${document.location.origin}/welcome`;

        this.authService.logout(
          {
            returnTo: returnUrl,
            client_id: environment.auth.clientId
          });

        this.navigationService.goToWelcomePage();
      })
    ), { dispatch: false }
  );

}
