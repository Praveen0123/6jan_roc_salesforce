import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LifetimeEarningsService, RoiModelService } from './services';

@NgModule({
  imports:
    [
      CommonModule
    ],
  declarations:
    [
    ],
  exports:
    [
    ],
  providers:
    [
      LifetimeEarningsService,
      RoiModelService
    ]
})
export class RoiModelModule { }
