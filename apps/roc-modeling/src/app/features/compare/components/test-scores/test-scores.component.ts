import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CompareModel } from '@app/+state/compare/state';


@Component({
  selector: 'roc-test-scores',
  templateUrl: './test-scores.component.html',
  styleUrls: ['./test-scores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestScoresComponent implements OnInit
{
  @Input() compareModel: CompareModel;

  constructor() { }

  ngOnInit(): void
  {
  }

}
