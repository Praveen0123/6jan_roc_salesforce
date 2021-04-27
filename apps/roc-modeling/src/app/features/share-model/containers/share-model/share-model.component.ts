import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoiModelFacadeService } from '@app/+state/roi-model';
import { NavigationService } from '@app/core/services';
import { RoiModelDto } from '@app/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'roc-share-model',
  templateUrl: './share-model.component.html',
  styleUrls: ['./share-model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareModelComponent implements OnInit
{
  formGroup: FormGroup;
  roiModelDto$: Observable<RoiModelDto>;

  constructor
    (
      private formBuilder: FormBuilder,
      private roiModelFacadeService: RoiModelFacadeService,
      private navigationService: NavigationService
    ) { }

  ngOnInit()
  {
    this.buildForm();

    this.roiModelDto$ = this.roiModelFacadeService.getSelectedRoiModel$();
  }

  onSaveClick(): void
  {
    if (this.formGroup.valid)
    {
      const shareWithModel =
      {
        firstName: this.formGroup.controls.firstName.value,
        lastName: this.formGroup.controls.lastName.value,
        emailAddress: this.formGroup.controls.emailAddress.value
      };

      console.log('SHARE WITH', shareWithModel);

      // this.userFacadeService.setUserName(userName.firstName, userName.lastName);
    }
  }

  onCancelClick(): void
  {
    this.navigationService.goToModelingPage();
  }



  private buildForm()
  {
    this.formGroup = this.formBuilder.group
      ({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        emailAddress: new FormControl('', [Validators.required, Validators.email]),
      });
  }

}
