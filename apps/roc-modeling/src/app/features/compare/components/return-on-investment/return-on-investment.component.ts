import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CompareModel } from '@app/+state/compare/state';

@Component({
  selector: 'roc-return-on-investment',
  templateUrl: './return-on-investment.component.html',
  styleUrls: ['./return-on-investment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReturnOnInvestmentComponent implements OnInit
{
  @Input() compareModel: CompareModel;

  constructor() { }

  ngOnInit(): void
  {
  }

}
