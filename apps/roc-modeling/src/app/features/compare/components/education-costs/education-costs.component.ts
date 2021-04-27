import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CompareModel } from '@app/+state/compare/state';


@Component({
  selector: 'roc-education-costs',
  templateUrl: './education-costs.component.html',
  styleUrls: ['./education-costs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EducationCostsComponent implements OnInit
{
  @Input() compareModel: CompareModel;

  constructor() { }

  ngOnInit(): void
  {
  }

}
