import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AccordionEffects } from './effects';
import { AccordionFacadeService } from './facade.service';
import { accordionReducer } from './reducer';
import { ACCORDION_STORE_FEATURE_KEY } from './state';


@NgModule({
  imports:
    [
      CommonModule,
      StoreModule.forFeature
        (
          ACCORDION_STORE_FEATURE_KEY,
          accordionReducer
        ),
      EffectsModule.forFeature([AccordionEffects])
    ],
  declarations:
    [

    ],
  providers:
    [
      AccordionFacadeService
    ]
})
export class AccordionStateModule { }
