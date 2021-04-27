import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CompareModel } from '@app/+state/compare/state';


@Component({
  selector: 'roc-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstitutionComponent implements OnInit
{
  @Input() compareModel: CompareModel;

  constructor() { }

  ngOnInit(): void
  {
  }

}
