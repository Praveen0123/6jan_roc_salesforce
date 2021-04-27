import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MaterialModule } from '../material/material.module';
import { PipesModule } from '../pipes/pipes.module';
import { ButtonWithIconComponent } from './button-with-icon/button-with-icon.component';
import { DialogCloneModelComponent } from './dialog-clone-model/dialog-clone-model.component';
import { DialogConfirmationComponent } from './dialog-confirmation/dialog-confirmation.component';
import { NotificationsSnackBarComponent } from './notifications-snack-bar/notifications-snack-bar.component';
import { OwlIconComponent } from './owl-icon/owl-icon.component';
import { SliderComponent } from './slider/slider.component';


@NgModule({
  imports:
    [
      CommonModule,
      ClipboardModule,
      ReactiveFormsModule,
      PipesModule,
      FontAwesomeModule,
      MaterialModule
    ],
  declarations:
    [
      ButtonWithIconComponent,
      DialogCloneModelComponent,
      DialogConfirmationComponent,
      NotificationsSnackBarComponent,
      OwlIconComponent,
      SliderComponent
    ],
  exports:
    [
      ButtonWithIconComponent,
      NotificationsSnackBarComponent,
      OwlIconComponent,
      SliderComponent
    ],
  entryComponents:
    [
      DialogCloneModelComponent,
      DialogConfirmationComponent,
      NotificationsSnackBarComponent
    ]
})
export class ComponentsModule { }
