import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';

import { SavedModelComponent } from './components/saved-model/saved-model.component';
import { FooterComponent } from './containers/footer/footer.component';
import { HeaderComponent } from './containers/header/header.component';
import { OffCanvasSavedModelsComponent } from './containers/off-canvas-saved-models/off-canvas-saved-models.component';
import { PageNotFoundComponent } from './containers/page-not-found/page-not-found.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';

@NgModule({
  imports:
    [
      ClipboardModule,
      CommonModule,
      RouterModule,
      SharedModule
    ],
  declarations:
    [
      FooterComponent,
      HeaderComponent,
      OffCanvasSavedModelsComponent,
      PageNotFoundComponent,
      SavedModelComponent,
      FeedbackFormComponent
    ],
  exports:
    [
      FooterComponent,
      HeaderComponent,
      OffCanvasSavedModelsComponent,
      PageNotFoundComponent
    ]
})
export class CommonUIModule { }
