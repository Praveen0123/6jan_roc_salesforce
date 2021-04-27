import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData
{
  message: string;
}

@Component({
  selector: 'roc-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogConfirmationComponent implements OnInit
{

  constructor
    (
      public dialogRef: MatDialogRef<DialogConfirmationComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

  ngOnInit(): void
  {
  }

  onNoClick(): void
  {
    this.dialogRef.close(false);
  }

  onYesClick(): void
  {
    this.dialogRef.close(true);
  }

}
