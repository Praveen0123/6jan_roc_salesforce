import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONFIG } from '@app/config/config';
import { CareerGoalForm } from '@app/core/models';
import { CareerGoalDto, RoiModelDto } from '@app/domain';
import { Occupation } from '@gql';
import { CareerGoalPathEnum, EducationLevelEnum } from '@models/enums';
import { AutoCompleteModel, AutoCompleteTypeEnum } from '@vantage-point/auto-complete-textbox';
import orderBy from 'lodash.orderby';
import { map, takeWhile } from 'rxjs/operators';


@Component({
  selector: 'roc-explore-degrees',
  templateUrl: './explore-degrees.component.html',
  styleUrls: ['./explore-degrees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExploreDegreesComponent implements OnInit, OnDestroy, OnChanges
{
  private alive: boolean = true;

  @Input() roiModelDto: RoiModelDto;
  @Output('onExploreDegreesSubmitted') formSubmissionEventEmitter = new EventEmitter<CareerGoalForm>();

  formGroup: FormGroup;
  autoCompleteTypeEnum: typeof AutoCompleteTypeEnum = AutoCompleteTypeEnum;

  availableEducationLevel: EducationLevelEnum[];
  retirementAgeMinimum: number = CONFIG.CAREER_GOAL.RETIREMENT_AGE_MINIMUM;
  retirementAgeMaximum: number = CONFIG.CAREER_GOAL.RETIREMENT_AGE_MAXIMUM;
  occupationList: AutoCompleteModel[];


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

  compareEducationLevelFunction(option: EducationLevelEnum, selectedItem: EducationLevelEnum): boolean
  {
    return (option && selectedItem) ? option.value === selectedItem.value : false;
  }

  compareOccupationFunction(option: AutoCompleteModel, selectedItem: AutoCompleteModel): boolean
  {
    return (option && selectedItem) ? option.id === selectedItem.id : false;
  }


  private initialize()
  {
    this.availableEducationLevel = EducationLevelEnum.getEducationLevelGoalOptions();
    this.occupationList = this.occupationListFromInstructionalProgram();

    this.buildForm();
  }

  private buildForm()
  {
    const careerGoalForm: CareerGoalForm = this.toCareerGoalForm();

    this.formGroup = this.formBuilder.group
      ({
        location: [careerGoalForm.location],
        occupation: [careerGoalForm.occupation],
        degreeLevel: [careerGoalForm.degreeLevel, Validators.required],
        degreeProgram: [careerGoalForm.degreeProgram, Validators.required],
        retirementAge: [careerGoalForm.retirementAge]
      });

    this.buildValueChange();
  }

  private buildValueChange()
  {
    this.formGroup.valueChanges
      .pipe
      (
        takeWhile(() => this.alive),
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
      const degreeProgram: AutoCompleteModel = this.formGroup.controls.degreeProgram.value;
      const occupation: AutoCompleteModel = (degreeProgram === null) ? null : this.formGroup.controls.occupation.value;

      const careerGoalForm: CareerGoalForm =
      {
        location: this.formGroup.controls.location.value,
        occupation: occupation,
        degreeLevel: this.formGroup.controls.degreeLevel.value,
        degreeProgram: degreeProgram,
        retirementAge: this.formGroup.controls.retirementAge.value,
        isValid: this.formGroup.valid,
        careerGoalPathType: CareerGoalPathEnum.ExploreDegrees
      };

      this.formSubmissionEventEmitter.emit(careerGoalForm);
    }
  }

  private toCareerGoalForm(): CareerGoalForm
  {
    const careerGoal: CareerGoalDto = this.roiModelDto?.careerGoal;

    const location: AutoCompleteModel = (careerGoal?.location)
      ? careerGoal.location.autoCompleteModel
      : null;

    const occupation: AutoCompleteModel = (careerGoal?.occupation)
      ? careerGoal.occupation.autoCompleteModel
      : null;

    const degreeProgram: AutoCompleteModel = (careerGoal?.degreeProgram)
      ? { id: careerGoal.degreeProgram.cipCode, name: careerGoal.degreeProgram.cipTitle }
      : null;

    const careerGoalForm: CareerGoalForm =
    {
      location: location,
      occupation: occupation,
      degreeLevel: careerGoal?.degreeLevel,
      degreeProgram: degreeProgram,
      retirementAge: careerGoal?.retirementAge,
      isValid: false,
      careerGoalPathType: CareerGoalPathEnum.ExploreDegrees
    };

    return careerGoalForm;
  }

  private occupationListFromInstructionalProgram(): AutoCompleteModel[]
  {
    const list: Occupation[] = this.roiModelDto?.careerGoal.degreeProgram?.occupations;
    const occupation: Occupation = this.roiModelDto?.careerGoal.occupation;
    const results: AutoCompleteModel[] = [];

    if (list && list.length > 0)
    {
      list.map((item: Occupation) =>
      {
        const autoCompleteModel: AutoCompleteModel =
        {
          id: item.onetCode,
          name: (occupation && occupation.onetCode === item.onetCode) ? occupation.title : item.title
        };

        results.push(autoCompleteModel);
      });
    }

    return orderBy(results, ['name'], ['asc']);
  }
}
