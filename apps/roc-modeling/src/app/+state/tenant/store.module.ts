import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { TenantEffects } from './effects';
import { TenantFacadeService } from './facade.service';
import { tenantReducer } from './reducer';
import { TENANT_STORE_FEATURE_KEY } from './state';


@NgModule({
  imports:
    [
      CommonModule,
      StoreModule.forFeature
        (
          TENANT_STORE_FEATURE_KEY,
          tenantReducer
        ),
      EffectsModule.forFeature([TenantEffects])
    ],
  declarations:
    [

    ],
  providers:
    [
      TenantFacadeService
    ]
})
export class TenantStateModule { }
