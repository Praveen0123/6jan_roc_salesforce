import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShareModelComponent } from './containers/share-model/share-model.component';

const routes: Routes =
  [
    {
      path: '',
      component: ShareModelComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShareModelRoutingModule { }
