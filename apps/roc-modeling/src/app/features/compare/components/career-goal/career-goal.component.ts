import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CompareModel } from '@app/+state/compare/state';


@Component({
  selector: 'roc-career-goal',
  templateUrl: './career-goal.component.html',
  styleUrls: ['./career-goal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareerGoalComponent implements OnInit
{
  @Input() compareModel: CompareModel;

  constructor() { }

  ngOnInit(): void
  {
  }

}
