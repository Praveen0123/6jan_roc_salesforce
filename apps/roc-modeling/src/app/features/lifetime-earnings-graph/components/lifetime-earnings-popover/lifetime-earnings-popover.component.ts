import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RocChartPopoverData } from '@app/domain/roi-model/models';
import { faTimes } from '@fortawesome/pro-light-svg-icons';


@Component({
  selector: 'roc-lifetime-earnings-popover',
  templateUrl: './lifetime-earnings-popover.component.html',
  styleUrls: ['./lifetime-earnings-popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LifetimeEarningsPopoverComponent implements OnInit
{
  constructor(
    public dialogRef: MatDialogRef<LifetimeEarningsPopoverComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { rocChartPopoverData: RocChartPopoverData; }
  ) { }

  closeIcon = faTimes;

  ngOnInit(): void { }

  closeDialog(): void
  {
    this.dialogRef.close();
  }
}
