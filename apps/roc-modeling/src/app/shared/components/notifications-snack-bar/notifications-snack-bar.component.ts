import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { UseCaseError } from '@vantage-point/ddd-core';

export interface NotificationsSnackBarModel
{
  message: string;
  error: UseCaseError | Error;
}

@Component({
  selector: 'roc-notifications-snack-bar',
  templateUrl: './notifications-snack-bar.component.html',
  styleUrls: ['./notifications-snack-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsSnackBarComponent implements OnInit
{
  clipboardData: string;

  constructor
    (
      @Inject(MAT_SNACK_BAR_DATA) public data: NotificationsSnackBarModel,
      private snackBarRef: MatSnackBarRef<NotificationsSnackBarComponent>
    ) { }

  ngOnInit(): void
  {
    this.clipboardData = (this.data.error) ? JSON.stringify(this.data.error) : null;
  }

  onDismiss()
  {
    this.snackBarRef.dismissWithAction();
  }
}
