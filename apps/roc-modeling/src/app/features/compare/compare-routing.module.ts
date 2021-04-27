import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompareComponent } from './containers/compare/compare.component';

const routes: Routes =
  [
    {
      path: '',
      component: CompareComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompareRoutingModule { }
