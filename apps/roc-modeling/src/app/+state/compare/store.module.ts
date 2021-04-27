import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoiModelModule } from '@app/domain';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CompareStoreEffects } from './effects';
import { reducer } from './reducer';
import { COMPARE_STORE_FEATURE_KEY } from './state';


@NgModule({
  imports:
    [
      CommonModule,
      StoreModule.forFeature(COMPARE_STORE_FEATURE_KEY, reducer),
      EffectsModule.forFeature([CompareStoreEffects]),
      RoiModelModule
    ],
  declarations:
    [

    ]
})
export class CompareStoreModule { }
