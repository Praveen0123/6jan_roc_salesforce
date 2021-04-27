import { UserProfile } from '@gql';

export const USER_STORE_FEATURE_KEY = 'user';

export interface Roles
{
  isUser: boolean;
  isManager: boolean;
  isAdmin: boolean;
}

export interface UserState
{
  userProfile: UserProfile;
  roles: Roles;
  error: any;
}

export const initialUserState: UserState =
{
  userProfile: null,
  roles: null,
  error: null
};
