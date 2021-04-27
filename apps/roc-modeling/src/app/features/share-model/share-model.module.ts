import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { ShareModelComponent } from './containers/share-model/share-model.component';
import { ShareModelRoutingModule } from './share-model-routing.module';


@NgModule({
  imports:
    [
      CommonModule,
      SharedModule,
      ShareModelRoutingModule
    ],
  declarations:
    [
      ShareModelComponent
    ]
})
export class ShareModelModule { }
