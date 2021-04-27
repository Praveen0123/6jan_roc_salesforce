import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HighSchoolComponent } from './components/high-school/high-school.component';
import { UserNameComponent } from './components/user-name/user-name.component';
import { UserTypeComponent } from './components/user-type/user-type.component';
import { OnBoardingComponent } from './containers/on-boarding/on-boarding.component';
import { WaitForValidationComponent } from './containers/wait-for-validation/wait-for-validation.component';

const routes: Routes =
  [
    {
      path: '',
      component: OnBoardingComponent,
      children:
        [
          { path: '', redirectTo: 'user-name', pathMatch: 'full' },
          { path: 'user-name', component: UserNameComponent },
          { path: 'user-type', component: UserTypeComponent },
          { path: 'high-school', component: HighSchoolComponent }
        ]
    },
    {
      path: 'wait-for-validation',
      component: WaitForValidationComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnBoardingRoutingModule { }
