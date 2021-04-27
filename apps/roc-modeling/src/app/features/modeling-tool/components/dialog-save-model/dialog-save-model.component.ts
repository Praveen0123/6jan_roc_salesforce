import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoiModelDto } from '@app/domain';


export interface DialogSaveModel
{
  isSaveAndContinue: boolean;
  modelName: string;
}


@Component({
  selector: 'roc-dialog-save-model',
  templateUrl: './dialog-save-model.component.html',
  styleUrls: ['./dialog-save-model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogSaveModelComponent implements OnInit
{
  formGroup: FormGroup;

  constructor
    (
      private formBuilder: FormBuilder,
      private dialogRef: MatDialogRef<DialogSaveModelComponent>,
      @Inject(MAT_DIALOG_DATA) private data: RoiModelDto
    ) { }

  ngOnInit(): void
  {
    this.buildForm();
  }

  onCancelClick(): void
  {
    this.dialogRef.close();
  }

  onSaveAndNewClick(): void
  {
    const dialogSaveModel: DialogSaveModel =
    {
      isSaveAndContinue: false,
      modelName: this.formGroup.controls.modelName.value
    };

    this.dialogRef.close(dialogSaveModel);
  }

  onSaveAndContinueClick(): void
  {
    const dialogSaveModel: DialogSaveModel =
    {
      isSaveAndContinue: true,
      modelName: this.formGroup.controls.modelName.value
    };

    this.dialogRef.close(dialogSaveModel);
  }



  private buildForm()
  {
    this.formGroup = this.formBuilder.group
      ({
        modelName: [this.data.name, Validators.required]
      });
  }
}
