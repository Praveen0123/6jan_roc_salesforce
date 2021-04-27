import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { OffCanvasEffects } from './effects';
import { OffCanvasFacadeService } from './facade.service';
import { offCanvasReducer } from './reducer';
import { OFF_CANVAS_STORE_FEATURE_KEY } from './state';


@NgModule({
  imports:
    [
      CommonModule,
      StoreModule.forFeature
        (
          OFF_CANVAS_STORE_FEATURE_KEY,
          offCanvasReducer
        ),
      EffectsModule.forFeature([OffCanvasEffects])
    ],
  declarations:
    [

    ],
  providers:
    [
      OffCanvasFacadeService
    ]
})
export class OffCanvasStateModule { }
