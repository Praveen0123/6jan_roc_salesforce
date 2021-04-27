import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthorizedComponent } from './containers/authorized/authorized.component';


@NgModule({
  imports:
    [
      CommonModule,
      SharedModule,
      AuthRoutingModule
    ],
  declarations:
    [
      AuthorizedComponent
    ]
})
export class AuthModule { }
