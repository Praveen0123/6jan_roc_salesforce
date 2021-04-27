import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CompareModel } from '@app/+state/compare/state';


@Component({
  selector: 'roc-model-graph',
  templateUrl: './model-graph.component.html',
  styleUrls: ['./model-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelGraphComponent implements OnInit
{
  @Input() compareModel: CompareModel;

  constructor() { }

  ngOnInit(): void
  {
  }

}
