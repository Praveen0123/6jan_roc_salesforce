import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'roc-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackFormComponent implements OnInit
{


  feedbackForm: FormGroup;
  applicationDefect: FormGroup;
  feedbackSelectedValue: any;
  degreeAlignmentWithCareer = [
    'Application defect',
    'Suggestion',
    'Compliment',
    'General Question',

  ];


  constructor(public dialogRef: MatDialogRef<FeedbackFormComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {
    this.createsFeedbackForm();
  }


  createsFeedbackForm()
  {
    this.feedbackForm = this.fb.group({
      feedbackFormSelection: [''],

    });
  }

  ngOnInit(): void
  {
  }
  // CLOSE DIALOG WITH CLOSE ICON
  close(): void
  {
    this.dialogRef.close();
  }
  // DEGREE ALIGNMENT WITH CAREER FILTER
  feedbackFormSelected(selectedValue: MatSelectChange): void
  {
    console.log(selectedValue, "selected");
    this.feedbackSelectedValue = selectedValue;
  }


}
