import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { LifetimeEarningsService } from '@app/domain';
import { RocChartPlotMarker, RocChartPopoverData } from '@app/domain/roi-model/models';

import { LifetimeEarningsPopoverComponent } from '../../components/lifetime-earnings-popover/lifetime-earnings-popover.component';


@Component({
  selector: 'roc-lifetime-earnings-graph',
  templateUrl: './lifetime-earnings-graph.component.html',
  styleUrls: ['./lifetime-earnings-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LifetimeEarningsGraphComponent implements OnInit
{
  popoverRef: MatDialogRef<LifetimeEarningsPopoverComponent>;
  chartClickUsed = true;

  constructor
    (
      public lifetimeEarningsService: LifetimeEarningsService,
      private dialog: MatDialog
    ) { }

  ngOnInit(): void
  {
  }

  onChartClick(data: RocChartPlotMarker): void
  {
    this.chartClickUsed = false;

    if (this.popoverRef && this.popoverRef.getState() === MatDialogState.OPEN)
    {
      this.popoverRef.close();
      this.popoverRef = null;
    }

    const rocChartPopoverData: RocChartPopoverData = this.lifetimeEarningsService.calculatePopoverData(data);


    if (
      (!this.popoverRef || !this.popoverRef.componentInstance) &&
      !this.chartClickUsed
    )
    {
      this.chartClickUsed = true;
      this.popoverRef = this.dialog.open
        (
          LifetimeEarningsPopoverComponent,
          {
            data:
            {
              rocChartPopoverData
            },
            panelClass: 'full-bleed-mat-dialog',
            autoFocus: false,
            hasBackdrop: false,
            position:
            {
              top: data.mouseEvent.clientY + 'px',
              left: data.mouseEvent.clientX + 'px',
            },
          }
        );
    }
    else if (this.popoverRef.componentInstance)
    {
      this.popoverRef.componentInstance.data =
      {
        rocChartPopoverData
      };
    }
  }

}
