import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LifetimeEarningsChartComponent } from './components/lifetime-earnings-chart/lifetime-earnings-chart.component';
import { LifetimeEarningsLegendComponent } from './components/lifetime-earnings-legend/lifetime-earnings-legend.component';
import { LifetimeEarningsPlaceholderComponent } from './components/lifetime-earnings-placeholder/lifetime-earnings-placeholder.component';
import { LifetimeEarningsPopoverComponent } from './components/lifetime-earnings-popover/lifetime-earnings-popover.component';
import { LifetimeEarningsGraphComponent } from './containers/lifetime-earnings-graph/lifetime-earnings-graph.component';

@NgModule({
  imports:
    [
      CommonModule,
      FontAwesomeModule,
      PipesModule
    ],
  declarations:
    [
      LifetimeEarningsChartComponent,
      LifetimeEarningsLegendComponent,
      LifetimeEarningsPopoverComponent,
      LifetimeEarningsGraphComponent,
      LifetimeEarningsPlaceholderComponent
    ],
  exports:
    [
      LifetimeEarningsGraphComponent
    ],
  providers:
    [
    ]
})
export class LifetimeEarningsGraphModule { }
