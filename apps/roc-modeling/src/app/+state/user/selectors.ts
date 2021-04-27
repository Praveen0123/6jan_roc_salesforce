import { UserProfile } from '@gql';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { Roles, USER_STORE_FEATURE_KEY, UserState } from './state';


// RETRIEVE SLICE OF STATE
export const userSlice: MemoizedSelector<object, UserState> = createFeatureSelector<UserState>(USER_STORE_FEATURE_KEY);


export const getUserProfile: MemoizedSelector<object, UserProfile> = createSelector
  (
    userSlice,
    (state: UserState): UserProfile => state.userProfile
  );


export const getRoles: MemoizedSelector<object, Roles> = createSelector
  (
    userSlice,
    (state: UserState): Roles => state.roles
  );


export const hasCompletedOnboarding: MemoizedSelector<object, boolean> = createSelector
  (
    userSlice,
    (state: UserState): boolean => state.userProfile?.hasCompletedOnboarding ?? false
  );
