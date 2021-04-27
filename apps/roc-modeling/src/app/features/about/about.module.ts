import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './containers/about/about.component';


@NgModule({
  imports:
    [
      AboutRoutingModule,
      CommonModule,
      SharedModule
    ],
  declarations:
    [
      AboutComponent
    ]
})
export class AboutModule { }
