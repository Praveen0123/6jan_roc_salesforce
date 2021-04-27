import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UserEffects } from './effects';
import { UserFacadeService } from './facade.service';
import { userReducer } from './reducer';
import { USER_STORE_FEATURE_KEY } from './state';


@NgModule({
  imports:
    [
      CommonModule,
      StoreModule.forFeature
        (
          USER_STORE_FEATURE_KEY,
          userReducer
        ),
      EffectsModule.forFeature([UserEffects])
    ],
  declarations:
    [

    ],
  providers:
    [
      UserFacadeService
    ]
})
export class UserStateModule { }
