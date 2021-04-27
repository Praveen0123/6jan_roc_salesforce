import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONFIG } from '@app/config/config';
import { CareerGoalForm } from '@app/core/models';
import { CareerGoalDto, RoiModelDto } from '@app/domain';
import { InstructionalProgram } from '@gql';
import { CareerGoalPathEnum, EducationLevelEnum } from '@models/enums';
import { AutoCompleteModel, AutoCompleteTypeEnum } from '@vantage-point/auto-complete-textbox';
import orderBy from 'lodash.orderby';
import { map, takeWhile } from 'rxjs/operators';


@Component({
  selector: 'roc-explore-careers',
  templateUrl: './explore-careers.component.html',
  styleUrls: ['./explore-careers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExploreCareersComponent implements OnInit, OnDestroy, OnChanges
{
  private alive: boolean = true;

  @Input() roiModelDto: RoiModelDto;
  @Output('onExploreCareersSubmitted') formSubmissionEventEmitter = new EventEmitter<CareerGoalForm>();

  formGroup: FormGroup;
  autoCompleteTypeEnum: typeof AutoCompleteTypeEnum = AutoCompleteTypeEnum;

  availableEducationLevel: EducationLevelEnum[];
  retirementAgeMinimum: number = CONFIG.CAREER_GOAL.RETIREMENT_AGE_MINIMUM;
  retirementAgeMaximum: number = CONFIG.CAREER_GOAL.RETIREMENT_AGE_MAXIMUM;
  instructionalProgramList: AutoCompleteModel[];


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

  compareDegreeProgramFunction(option: AutoCompleteModel, selectedItem: AutoCompleteModel): boolean
  {
    return (option && selectedItem) ? option.id === selectedItem.id : false;
  }


  private initialize()
  {
    this.availableEducationLevel = EducationLevelEnum.getEducationLevelGoalOptions();
    this.instructionalProgramList = this.instructionalProgramListFromOccupation();

    this.buildForm();
  }

  private buildForm()
  {
    const careerGoalForm: CareerGoalForm = this.toCareerGoalForm();

    this.formGroup = this.formBuilder.group
      ({
        location: [careerGoalForm.location],
        occupation: [careerGoalForm.occupation, Validators.required],
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
      const occupation: AutoCompleteModel = this.formGroup.controls.occupation.value;
      const degreeProgram: AutoCompleteModel = (occupation === null) ? null : this.formGroup.controls.degreeProgram.value;

      const careerGoalForm: CareerGoalForm =
      {
        location: this.formGroup.controls.location.value,
        occupation: occupation,
        degreeLevel: this.formGroup.controls.degreeLevel.value,
        degreeProgram: degreeProgram,
        retirementAge: this.formGroup.controls.retirementAge.value,
        isValid: this.formGroup.valid,
        careerGoalPathType: CareerGoalPathEnum.ExploreCareers
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
      careerGoalPathType: CareerGoalPathEnum.ExploreCareers
    };

    return careerGoalForm;
  }

  private instructionalProgramListFromOccupation(): AutoCompleteModel[]
  {
    const list: InstructionalProgram[] = this.roiModelDto?.careerGoal.occupation?.instructionalProgramList;
    const results: AutoCompleteModel[] = [];

    if (list && list.length > 0)
    {
      list.map((item: InstructionalProgram) =>
      {
        const autoCompleteModel: AutoCompleteModel =
        {
          id: item.cipCode,
          name: item.cipTitle
        };

        results.push(autoCompleteModel);
      });
    }

    return orderBy(results, ['name'], ['asc']);
  }
}
