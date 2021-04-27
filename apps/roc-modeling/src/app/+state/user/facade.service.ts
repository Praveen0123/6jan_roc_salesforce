import { Injectable } from '@angular/core';
import { UserProfile, UserType } from '@gql';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { requestLogin, requestLogout, requestUserAfterAuthentication, setHighSchool, setUserName, setUserType } from './actions';
import { getRoles, getUserProfile, hasCompletedOnboarding } from './selectors';
import { Roles } from './state';


@Injectable()
export class UserFacadeService
{

  constructor
    (
      private store: Store
    ) { }

  requestUserAfterAuthentication()
  {
    this.store.dispatch(requestUserAfterAuthentication());
  }

  getUserProfile$(): Observable<UserProfile>
  {
    return this.store.pipe(select(getUserProfile));
  }

  getRoles$(): Observable<Roles>
  {
    return this.store.pipe(select(getRoles));
  }

  requestLogin()
  {
    this.store.dispatch(requestLogin());
  }

  requestLogout()
  {
    this.store.dispatch(requestLogout());
  }

  setUserName(firstName: string, lastName: string)
  {
    this.store.dispatch(setUserName({ firstName, lastName }));
  }

  setUserType(userType: UserType)
  {
    this.store.dispatch(setUserType({ userType }));
  }

  setHighSchool(id: string)
  {
    this.store.dispatch(setHighSchool({ id }));
  }

  hasCompletedOnboarding$(): Observable<boolean>
  {
    return this.store.pipe(select(hasCompletedOnboarding));
  }


}
