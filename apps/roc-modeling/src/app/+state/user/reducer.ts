import { createReducer, on } from '@ngrx/store';

import { requestLogout, setActiveUser, setHighSchool, setRoles, setUserName, setUserType } from './actions';
import { initialUserState } from './state';



export const userReducer = createReducer
  (
    initialUserState,


    on(setActiveUser, (state, { userProfile }) => ({ ...state, userProfile })),

    on(setRoles, (state, { roles }) => ({ ...state, roles })),

    on(setUserName, (state, { firstName, lastName }) => (
      {
        ...state, userProfile:
        {
          ...state.userProfile,
          firstName: firstName,
          lastName: lastName
        }
      })),

    on(setUserType, (state, { userType }) => (
      {
        ...state, userProfile:
        {
          ...state.userProfile,
          userType: userType
        }
      })),

    on(setHighSchool, (state, { id }) => (
      {
        ...state, userProfile:
        {
          ...state.userProfile,
          highSchoolId: id
        }
      })),

    on(requestLogout, () => ({ ...initialUserState }))

  );
