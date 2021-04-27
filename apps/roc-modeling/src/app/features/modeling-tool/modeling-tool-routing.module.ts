import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ModelingToolComponent } from './containers/modeling-tool/modeling-tool.component';
import { ModelInitializationService } from './services/model-initialization-resolver.service';


const routes: Routes =
  [
    {
      path: '',
      component: ModelingToolComponent,
      resolve: { resolver: ModelInitializationService }
    }
  ];

@NgModule({
  imports:
    [
      RouterModule.forChild(routes)
    ],
  exports:
    [
      RouterModule
    ]
})
export class ModelingToolRoutingModule { }
