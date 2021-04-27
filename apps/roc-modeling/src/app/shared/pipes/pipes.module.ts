import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleLogPipe } from './consoleLog/console-log.pipe';
import { MoneyPipe } from './money/money.pipe';

@NgModule({
  declarations: [ConsoleLogPipe, MoneyPipe],
  imports: [CommonModule],
  exports: [ConsoleLogPipe, MoneyPipe]
})
export class PipesModule {}
