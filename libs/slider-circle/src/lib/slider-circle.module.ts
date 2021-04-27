import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { CurrencySuffixPipe } from './currency-suffix/currency-suffix.pipe';
import { SliderCircleComponent } from './slider-circle/slider-circle.component';

@NgModule({
  imports:
    [
      CommonModule
    ],
  declarations:
    [
      CurrencySuffixPipe,
      SliderCircleComponent
    ],
  exports:
    [
      CurrencySuffixPipe,
      SliderCircleComponent
    ],
  providers:
    [
      CurrencyPipe,
      CurrencySuffixPipe
    ]
})
export class SliderCircleModule { }
