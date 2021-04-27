import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SliderCircleModule } from '@returnon-college/slider-circle';
import { SharedModule } from '@shared/shared.module';
import { AutoCompleteTextboxModule } from '@vantage-point/auto-complete-textbox';

import { LifetimeEarningsGraphModule } from '../lifetime-earnings-graph/lifetime-earnings-graph.module';
import { CareerGoalsComponent } from './components/career-goals/career-goals.component';
import { CumulativeLoanSlidersComponent } from './components/cumulative-loan-sliders/cumulative-loan-sliders.component';
import { CurrentInformationComponent } from './components/current-information/current-information.component';
import { DialogSaveModelComponent } from './components/dialog-save-model/dialog-save-model.component';
import { EducationCostsComponent } from './components/education-costs/education-costs.component';
import { EducationFinancingComponent } from './components/education-financing/education-financing.component';
import { ExploreCareersComponent } from './components/explore-careers/explore-careers.component';
import { ExploreDegreesComponent } from './components/explore-degrees/explore-degrees.component';
import { ModelingToolControlsComponent } from './components/modeling-tool-controls/modeling-tool-controls.component';
import { ModelingToolTitleComponent } from './components/modeling-tool-title/modeling-tool-title.component';
import { RoiModelCallToActionsComponent } from './components/roi-model-call-to-actions/roi-model-call-to-actions.component';
import { UserProfileSummaryItemComponent } from './components/user-profile-summary-item/user-profile-summary-item.component';
import { UserProfileSummaryComponent } from './components/user-profile-summary/user-profile-summary.component';
import { ModelingToolComponent } from './containers/modeling-tool/modeling-tool.component';
import { ModelingToolRoutingModule } from './modeling-tool-routing.module';

@NgModule({
  imports:
    [
      ClipboardModule,
      CommonModule,
      AutoCompleteTextboxModule,
      LifetimeEarningsGraphModule,
      ModelingToolRoutingModule,
      SharedModule,
      SliderCircleModule
    ],
  declarations:
    [
      ModelingToolComponent,
      CurrentInformationComponent,
      CareerGoalsComponent,
      EducationCostsComponent,
      EducationFinancingComponent,
      ModelingToolControlsComponent,
      ModelingToolTitleComponent,
      ExploreCareersComponent,
      ExploreDegreesComponent,
      UserProfileSummaryComponent,
      RoiModelCallToActionsComponent,
      CumulativeLoanSlidersComponent,
      UserProfileSummaryItemComponent,
      DialogSaveModelComponent
    ],
  exports:
    [
      ModelingToolComponent
    ],
  entryComponents:
    [
      DialogSaveModelComponent
    ]
})
export class ModelingToolModule { }
