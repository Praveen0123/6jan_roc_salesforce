import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { CompareRoutingModule } from './compare-routing.module';
import { CareerGoalComponent } from './components/career-goal/career-goal.component';
import { CompareSectionComponent } from './components/compare-section/compare-section.component';
import { EducationCostsComponent } from './components/education-costs/education-costs.component';
import { FutureEarningsComponent } from './components/future-earnings/future-earnings.component';
import { InstitutionComponent } from './components/institution/institution.component';
import { ModelGraphComponent } from './components/model-graph/model-graph.component';
import { ReturnOnInvestmentComponent } from './components/return-on-investment/return-on-investment.component';
import { TestScoresComponent } from './components/test-scores/test-scores.component';
import { CompareComponent } from './containers/compare/compare.component';


@NgModule({
  imports:
    [
      CommonModule,
      CompareRoutingModule,
      SharedModule
    ],
  declarations:
    [
      CompareComponent,
      CareerGoalComponent,
      InstitutionComponent,
      TestScoresComponent,
      EducationCostsComponent,
      FutureEarningsComponent,
      ReturnOnInvestmentComponent,
      ModelGraphComponent,
      CompareSectionComponent
    ]
})
export class CompareModule { }
