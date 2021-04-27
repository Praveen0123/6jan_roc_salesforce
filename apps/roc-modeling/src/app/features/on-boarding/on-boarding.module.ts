import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { OnBoardingComponent } from './containers/on-boarding/on-boarding.component';
import { OnBoardingRoutingModule } from './on-boarding-routing.module';
import { UserNameComponent } from './components/user-name/user-name.component';
import { UserTypeComponent } from './components/user-type/user-type.component';
import { HighSchoolComponent } from './components/high-school/high-school.component';
import { WaitForValidationComponent } from './containers/wait-for-validation/wait-for-validation.component';


@NgModule({
  imports:
    [
      CommonModule,
      OnBoardingRoutingModule,
      SharedModule
    ],
  declarations:
    [
      OnBoardingComponent,
      UserNameComponent,
      UserTypeComponent,
      HighSchoolComponent,
      WaitForValidationComponent
    ]
})
export class OnBoardingModule { }
