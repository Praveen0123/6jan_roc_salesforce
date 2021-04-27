import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserFacadeService } from '@app/+state/user';
import { UserType } from '@gql';

@Component({
  selector: 'roc-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTypeComponent implements OnInit
{
  formGroup: FormGroup;
  userType = UserType;

  constructor
    (
      private formBuilder: FormBuilder,
      private userFacadeService: UserFacadeService
    ) { }

  ngOnInit(): void
  {
    this.buildForm();
  }

  onSaveClick(): void
  {
    if (this.formGroup.valid)
    {
      this.userFacadeService.setUserType(this.formGroup.controls.userType.value);
    }
  }

  // Preserve original property order
  originalOrder = (_a: KeyValue<number, string>, _b: KeyValue<number, string>): number =>
  {
    return 0;
  };



  private buildForm()
  {
    this.formGroup = this.formBuilder.group
      ({
        userType: new FormControl('', [Validators.required])
      });
  }

}
