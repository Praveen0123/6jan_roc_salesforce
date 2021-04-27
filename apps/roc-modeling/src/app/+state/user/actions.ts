import { UserProfile, UserType } from '@gql';
import { createAction, props } from '@ngrx/store';
import { UseCaseError } from '@vantage-point/ddd-core';

import { Roles } from './state';


export const requestUserAfterAuthentication = createAction
  (
    '[User] request user after authentication'
  );

export const saveUserProfileAfterOnBoarding = createAction
  (
    '[User] save user profile after on-boarding'
  );

export const setActiveUser = createAction
  (
    '[User] set active user',
    props<{ userProfile: UserProfile; }>()
  );

export const setUserName = createAction
  (
    '[User] set user name',
    props<{ firstName: string, lastName: string; }>()
  );

export const setUserType = createAction
  (
    '[User] set user type',
    props<{ userType: UserType; }>()
  );

export const setHighSchool = createAction
  (
    '[User] set high school',
    props<{ id: string; }>()
  );

export const setRoles = createAction
  (
    '[User] set roles',
    props<{ roles: Roles; }>()
  );



export const requestLogin = createAction
  (
    '[User] request login'
  );

export const requestLogout = createAction
  (
    '[User] request logout'
  );

export const loginErrorHappened = createAction
  (
    '[User] login error happened',
    props<{ useCaseError: UseCaseError; }>()
  );
