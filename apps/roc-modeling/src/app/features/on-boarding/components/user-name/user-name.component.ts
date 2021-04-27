import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserFacadeService } from '@app/+state/user';

@Component({
  selector: 'roc-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserNameComponent implements OnInit
{
  formGroup: FormGroup;

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
      const userName =
      {
        firstName: this.formGroup.controls.firstName.value,
        lastName: this.formGroup.controls.lastName.value
      };

      this.userFacadeService.setUserName(userName.firstName, userName.lastName);
    }
  }



  private buildForm()
  {
    this.formGroup = this.formBuilder.group
      ({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
      });
  }
}
