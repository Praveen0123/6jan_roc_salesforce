import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoiModelModule } from '@app/domain';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { RoiModelStoreEffects } from './effects';
import { reducer } from './reducer';
import { ROI_MODEL_STORE_FEATURE_KEY } from './state';


@NgModule({
  imports:
    [
      CommonModule,
      StoreModule.forFeature(ROI_MODEL_STORE_FEATURE_KEY, reducer),
      EffectsModule.forFeature([RoiModelStoreEffects]),
      RoiModelModule
    ],
  declarations:
    [

    ]
})
export class RoiModelStoreModule { }
