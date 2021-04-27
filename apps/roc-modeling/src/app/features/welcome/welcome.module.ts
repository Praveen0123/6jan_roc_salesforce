import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { WelcomeComponent } from './containers/welcome/welcome.component';
import { WelcomeRoutingModule } from './welcome-routing.module';


@NgModule({
  imports:
    [
      CommonModule,
      SharedModule,
      WelcomeRoutingModule
    ],
  declarations:
    [
      WelcomeComponent
    ]
})
export class WelcomeModule { }
