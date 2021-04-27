import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONFIG } from '@app/config/config';
import { CurrentInformationForm } from '@app/core/models';
import { CurrentInformationDto, RoiModelDto } from '@app/domain';
import { EducationLevelEnum } from '@models/enums';
import { AutoCompleteModel, AutoCompleteTypeEnum } from '@vantage-point/auto-complete-textbox';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'roc-current-information',
  templateUrl: './current-information.component.html',
  styleUrls: ['./current-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentInformationComponent implements OnInit, OnDestroy, OnChanges
{
  private alive: boolean = true;

  @Input() roiModelDto: RoiModelDto;
  @Output('onCurrentInformationSubmitted') formSubmissionEventEmitter = new EventEmitter<CurrentInformationForm>();

  formGroup: FormGroup;
  autoCompleteTypeEnum: typeof AutoCompleteTypeEnum = AutoCompleteTypeEnum;

  minimumAge: number = CONFIG.USER_PROFILE.MINIMUM_AGE;
  maximumAge: number = CONFIG.USER_PROFILE.MAXIMUM_AGE;
  availableEducationLevel: EducationLevelEnum[];

  constructor
    (
      private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void
  {
    this.initialize();
  }

  ngOnDestroy(): void
  {
    this.alive = false;
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.roiModelDto && !changes.roiModelDto.firstChange)
    {
      this.initialize();
    }
  }

  onFormSubmit(): void
  {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid)
    {
      this.emitFormSubmission();
    }
  }

  compareFunction(option: EducationLevelEnum, selectedItem: EducationLevelEnum): boolean
  {
    return (option && selectedItem) ? option.value === selectedItem.value : false;
  }



  private initialize()
  {
    this.availableEducationLevel = EducationLevelEnum.getCurrentEducationLevelOptions();

    this.buildForm();
  }

  private buildForm()
  {
    const currentInformationForm: CurrentInformationForm = this.toCurrentInformationForm();

    this.formGroup = this.formBuilder.group
      ({
        currentAge: [currentInformationForm.currentAge, Validators.required],
        currentOccupation: [currentInformationForm.currentOccupation],
        educationLevel: [currentInformationForm.educationLevel, Validators.required],
        currentLocation: [currentInformationForm.currentLocation, Validators.required]
      });

    this.buildValueChange();
  }

  private buildValueChange()
  {
    this.formGroup.valueChanges
      .pipe
      (
        takeWhile(() => this.alive),
        // filter(() =>
        // {
        //   return this.formGroup.valid;
        // }),
        map(() =>
        {
          this.emitFormSubmission();
        })
      ).subscribe();
  }

  private emitFormSubmission()
  {
    if (this.formSubmissionEventEmitter.observers.length > 0)
    {
      const currentInformationForm: CurrentInformationForm =
      {
        currentAge: this.formGroup.controls.currentAge.value,
        currentOccupation: this.formGroup.controls.currentOccupation.value,
        educationLevel: this.formGroup.controls.educationLevel.value,
        currentLocation: this.formGroup.controls.currentLocation.value,
        isValid: this.formGroup.valid
      };

      this.formSubmissionEventEmitter.emit(currentInformationForm);
    }
  }

  private toCurrentInformationForm(): CurrentInformationForm
  {
    const currentInformation: CurrentInformationDto = this.roiModelDto?.currentInformation;

    const currentOccupation: AutoCompleteModel = (currentInformation?.occupation)
      ? currentInformation.occupation.autoCompleteModel
      : null;

    const currentLocation: AutoCompleteModel = (currentInformation?.location)
      ? currentInformation.location.autoCompleteModel
      : null;

    const currentInformationForm: CurrentInformationForm =
    {
      currentAge: currentInformation?.currentAge,
      currentOccupation: currentOccupation,
      educationLevel: currentInformation?.educationLevel,
      currentLocation: currentLocation,
      isValid: false
    };

    return currentInformationForm;
  }

}
