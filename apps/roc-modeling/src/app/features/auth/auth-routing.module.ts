import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizedComponent } from './containers/authorized/authorized.component';

const routes: Routes =
  [
    {
      path: '',
      component: AuthorizedComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
