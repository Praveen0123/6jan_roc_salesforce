import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CompareModel } from '@app/+state/compare/state';


@Component({
  selector: 'roc-future-earnings',
  templateUrl: './future-earnings.component.html',
  styleUrls: ['./future-earnings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FutureEarningsComponent implements OnInit
{

  @Input() compareModel: CompareModel;

  constructor() { }

  ngOnInit(): void
  {
  }

}
