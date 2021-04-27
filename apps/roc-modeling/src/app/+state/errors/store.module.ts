import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ErrorsEffects } from './effects';
import { ErrorsFacadeService } from './facade.service';
import { errorsReducer } from './reducer';
import { ERROR_STORE_FEATURE_KEY } from './state';


@NgModule({
  imports:
    [
      CommonModule,
      StoreModule.forFeature
        (
          ERROR_STORE_FEATURE_KEY,
          errorsReducer
        ),
      EffectsModule.forFeature([ErrorsEffects])
    ],
  declarations:
    [

    ],
  providers:
    [
      ErrorsFacadeService
    ]
})
export class ErrorsStateModule { }
