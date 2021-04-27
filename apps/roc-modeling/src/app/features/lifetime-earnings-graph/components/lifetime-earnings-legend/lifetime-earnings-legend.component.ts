import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RocLegendData, RocPlotsVisibility } from '@app/domain/roi-model/models';



@Component({
  selector: 'roc-lifetime-earnings-legend',
  templateUrl: './lifetime-earnings-legend.component.html',
  styleUrls: ['./lifetime-earnings-legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LifetimeEarningsLegendComponent implements OnInit
{
  @Input() data: RocLegendData;
  @Input() roiSectionsVisibility: RocPlotsVisibility;
  // @Input() currentStateOccupation: OccupationsEntity;
  // @Input() goalStateOccupation: OccupationsEntity;

  constructor() { }

  ngOnInit(): void { }
}
