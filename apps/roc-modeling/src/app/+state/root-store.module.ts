import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { environment } from '@env/environment';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, RouterReducerState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { ACCORDION_STORE_FEATURE_KEY } from './accordion/state';
import { AccordionStateModule } from './accordion/store.module';
import { COMPARE_STORE_FEATURE_KEY } from './compare/state';
import { CompareStoreModule } from './compare/store.module';
import { ErrorsStateModule } from './errors/store.module';
import { OFF_CANVAS_STORE_FEATURE_KEY } from './off-canvas/state';
import { OffCanvasStateModule } from './off-canvas/store.module';
import { RoiModelStoreModule } from './roi-model/store.module';
import { TENANT_STORE_FEATURE_KEY } from './tenant/state';
import { TenantStateModule } from './tenant/store.module';
import { USER_STORE_FEATURE_KEY } from './user/state';
import { UserStateModule } from './user/store.module';

// Root State - extend all partial states
export interface IRootState
{
  router: RouterReducerState;
}

// Map root state's properties (partial states) to their reducers
export const reducers: ActionReducerMap<IRootState> =
{
  router: routerReducer
};

// Create a store meta reducer to allow caching in browser
export function storageSyncReducer(reducer: ActionReducer<IRootState>): any
{
  // provide all feature states within the features array
  // features which are not provided, do not get synced
  const metaReducer = storageSync(
    {
      features:
        [
          // save only router state to sessionStorage
          { stateKey: 'router', storageForFeature: window.sessionStorage },
          { stateKey: ACCORDION_STORE_FEATURE_KEY },
          { stateKey: COMPARE_STORE_FEATURE_KEY },
          { stateKey: OFF_CANVAS_STORE_FEATURE_KEY },
          { stateKey: TENANT_STORE_FEATURE_KEY },
          { stateKey: USER_STORE_FEATURE_KEY },
          // exclude key 'success' inside 'auth' and all keys 'loading' inside 'feature1'
          { stateKey: 'feature1', excludeKeys: ['auth.success', 'loading'] },
        ],
      storage: window.sessionStorage,
    });

  return metaReducer(reducer);
}

@NgModule({
  declarations:
    [
    ],
  imports:
    [
      CommonModule,
      StoreModule.forRoot
        (
          reducers,
          {
            metaReducers: typeof window !== 'undefined' ? [storageSyncReducer] : [],
            runtimeChecks: {
              strictActionImmutability: true,
              strictStateImmutability: true,
            },
          }
        ),
      EffectsModule.forRoot([]),
      StoreRouterConnectingModule.forRoot(),
      StoreDevtoolsModule.instrument
        (
          {
            maxAge: 25,
            logOnly: environment.production,
          }
        )
    ],
  exports:
    [
      AccordionStateModule,
      CompareStoreModule,
      ErrorsStateModule,
      OffCanvasStateModule,
      RoiModelStoreModule,
      TenantStateModule,
      UserStateModule
    ],
})
export class RootStoreModule { }
