import { AggregateRoot, Guard, Result, UniqueEntityID } from '@vantage-point/ddd-core';

import { CareerGoalDto, CurrentInformationDto, DialogDataToKeepModel, EducationCostDto, EducationFinancingDto } from '../dtos';
import { RoiModelMissingError } from '../errors';
import { CurrentInformationMapper } from '../mappers/current-information.mapper';
import { RoiCalculatorInput, RoiCalculatorOutputModel } from '../models';
import { CareerGoalProps } from './career-goal.model';
import { CurrentInformation } from './current-information.model';
import { EducationCostProps } from './education-costs.model';
import { RoiAggregateId } from './roi-aggregate-id';
import { RoiModel } from './roi-model';
import { RoiModelId } from './roi-model-id';


interface RoiAggregateProps
{
  currentInformation?: CurrentInformation;
  roiModel?: RoiModel;
}


export class RoiAggregate extends AggregateRoot<RoiAggregateProps>
{
  private _roiAggregateId: RoiAggregateId;
  private _activeRoiModelId: RoiModelId;
  private store: Map<string, RoiModel> = new Map();


  get roiAggregateId(): string
  {
    return this._roiAggregateId.id.toString();
  }
  get currentInformation(): CurrentInformation
  {
    return this.props.currentInformation;
  }
  get name(): string
  {
    return this.activeRoiModel.name;
  }
  get activeRoiModel(): RoiModel
  {
    const key: string = this._activeRoiModelId.id.toString();

    if (this.store.has(key))
    {
      return this.store.get(key);
    }

    throw RoiModelMissingError.create('MISSING ROI MODEL');
  }
  get roiCalculatorInput(): RoiCalculatorInput
  {
    return this.activeRoiModel.roiCalculatorInput;
  }
  get roiModelList(): RoiModel[]
  {
    return Array.from(this.store.values());
  }
  get roiModelCount(): number
  {
    return (this.store) ? this.store.size : 0;
  }


  private constructor(props: RoiAggregateProps, id?: UniqueEntityID)
  {
    super(props, id);

    this._roiAggregateId = RoiAggregateId.create(this._id);
    this.addRoiModelToInternalStore(props.roiModel);
  }

  static create(props: RoiAggregateProps, id?: UniqueEntityID): Result<RoiAggregate>
  {
    const propsResult = Guard.againstNullOrUndefinedBulk(
      [
      ]);

    if (!propsResult.succeeded)
    {
      return Result.failure<RoiAggregate>(propsResult.message || 'roi model properties error');
    }

    const roiModelAggregate = new RoiAggregate
      (
        {
          ...props,
          roiModel: props.roiModel
        },
        id
      );

    return Result.success<RoiAggregate>(roiModelAggregate);
  }

  static get defaultProps(): RoiAggregateProps
  {
    const currentInformationOrError: Result<CurrentInformation> = CurrentInformation.create(CurrentInformation.defaultProps);
    const roiModelOrError: Result<RoiModel> = RoiModel.create(RoiModel.defaultProps);

    if (currentInformationOrError.isSuccess && roiModelOrError.isSuccess)
    {
      const props: RoiAggregateProps =
      {
        currentInformation: currentInformationOrError.getValue(),
        roiModel: roiModelOrError.getValue()
      };

      return props;
    }

    return {
      currentInformation: null,
      roiModel: null
    };
  }


  createEmptyRoiModel(name?: string): void
  {
    const roiModelOrError: Result<RoiModel> = RoiModel.create
      (
        {
          ...RoiModel.defaultProps,
          name: name ?? this.getDefaultModelName()
        }
      );

    if (roiModelOrError.isSuccess)
    {
      this.addRoiModelToInternalStore(roiModelOrError.getValue());
    }
    else
    {
      throw roiModelOrError.getError();
    }
  }
  clone(dialogDataToKeepModel: DialogDataToKeepModel): void
  {
    const dupliciateOrFailure: Result<RoiModel> = RoiModel.create
      (
        {
          ...RoiModel.defaultProps,
          name: dialogDataToKeepModel.modelName
        }
      );

    if (dupliciateOrFailure.isSuccess)
    {
      const duplicateRoiModel: RoiModel = dupliciateOrFailure.getValue();


      /* #region  CAREER GOAL  */

      const careerGoalProps: CareerGoalProps = JSON.parse(JSON.stringify(this.activeRoiModel.props.careerGoal.props));

      if (dialogDataToKeepModel.isGoalLocationCloned)
      {
        duplicateRoiModel.setCareerGoalLocation(careerGoalProps.location);
      }

      if (dialogDataToKeepModel.isGoalOccupationCloned)
      {
        duplicateRoiModel.setCareerGoalOccupation(careerGoalProps.occupation);
      }

      if (dialogDataToKeepModel.isGoalDegreeLevelCloned)
      {
        duplicateRoiModel.setCareerGoalDegreeLevel(careerGoalProps.degreeLevel);
      }

      if (dialogDataToKeepModel.isGoalDegreeProgramCloned)
      {
        duplicateRoiModel.setCareerGoalDegreeProgram(careerGoalProps.degreeProgram);
      }

      if (dialogDataToKeepModel.isGoalRetirementAgeCloned)
      {
        duplicateRoiModel.setCareerGoalRetirementAge(careerGoalProps.retirementAge);
      }

      /* #endregion */


      /* #region  EDUCATION COSTS */

      const educationCostProps: EducationCostProps = JSON.parse(JSON.stringify(this.activeRoiModel.props.educationCost.props));

      if (dialogDataToKeepModel.isEducationCostInstitutionCloned)
      {
        duplicateRoiModel.setEducationCostInstitution(educationCostProps.institution);
      }

      if (dialogDataToKeepModel.isEducationCostStartSchoolCloned)
      {
        duplicateRoiModel.setEducationCostStartSchoolYear(educationCostProps.startYear);
      }

      if (dialogDataToKeepModel.isEducationCostPartTimeFullTimeCloned)
      {
        duplicateRoiModel.setEducationCostPartTimeFullTime(educationCostProps.isFulltime);
      }

      if (dialogDataToKeepModel.isEducationCostYearsToCompleteCloned)
      {
        duplicateRoiModel.setEducationCostYearsToComplete(educationCostProps.yearsToCompleteDegree);
      }

      /* #endregion */


      this.addRoiModelToInternalStore(duplicateRoiModel);
    }
  }
  makeActive(key: string): void
  {
    if (this.store.has(key))
    {
      this._activeRoiModelId = RoiModelId.create(key);
    }
    else
    {
      const message: string = `ROI Model (${key}) does not exist`;
      throw RoiModelMissingError.create(message);
    }
  }
  deleteRoiModel(roiModelId: RoiModelId): void
  {
    const key: string = roiModelId.id.toString();
    const activeKey: string = this._activeRoiModelId.id.toString();

    if (this.store.has(key))
    {
      this.store.delete(key);

      // IF STORE IS EMPTY, CREATE A NEW ROI MODEL
      if (this.store.size === 0)
      {
        this.createEmptyRoiModel();
      }

      // IF MODEL BEING DELETED IS ACTIVE MODEL, THEN FIND NEW ACTIVE
      else if (key === activeKey)
      {
        const nextRoiModel: RoiModel = this.roiModelList[0];

        this._activeRoiModelId = nextRoiModel.roiModelId;
      }
    }
  }
  updateRoiModelName(name: string)
  {
    this.activeRoiModel.updateRoiModelName(name);
  }

  loadRoiModelList(list: RoiModel[]): void
  {
    list.map((item: RoiModel) => this.addRoiModelToInternalStore(item));
  }

  toJSON = () =>
  {
    return {
      roiAggregateId: this._roiAggregateId.id.toValue(),
      activeRoiModelId: this._activeRoiModelId.id.toValue(),
      currentInformation: this.currentInformation,
      roiModelList: this.roiModelList
    };
  };



  /* #region  CURRENT INFORMATION */

  isCurrentInformationValid(): boolean
  {
    return this.props.currentInformation?.isValid() ?? false;
  }

  updateCurrentInformation(currentInformationDto: CurrentInformationDto): void
  {
    const successOrError: Result<CurrentInformation> = CurrentInformationMapper.create().toDomain(currentInformationDto);

    if (successOrError.isSuccess)
    {
      this.props.currentInformation = successOrError.getValue();
    }
    else
    {
      throw successOrError.getError();
    }
  }

  /* #endregion */



  /* #region  CAREER GOAL */

  updateCareerGoal(careerGoalDto: CareerGoalDto): void
  {
    this.activeRoiModel.updateCareerGoal(careerGoalDto);
  }

  isCareerGoalValid(): boolean
  {
    return this.activeRoiModel.isCareerGoalValid() ?? false;
  }

  /* #endregion */



  /* #region  EDUCATION COST */

  updateEducationCost(educationCostDto: EducationCostDto): void
  {
    this.activeRoiModel.updateEducationCost(educationCostDto, this.props.currentInformation);
  }

  isEducationCostValid(): boolean
  {
    return this.activeRoiModel.isEducationCostValid() ?? false;
  }

  /* #endregion */



  /* #region  EDUCATION FINANCING */

  updateEducationFinancing(educationFinancingDto: EducationFinancingDto): void
  {
    this.activeRoiModel.updateEducationFinancing(educationFinancingDto);
  }

  /* #endregion */



  /* #region  INPUT/OUTPUT */

  calculateRoiCalculatorInput(): Promise<boolean>
  {
    return this.activeRoiModel.calculateRoiCalculatorInput(this.props.currentInformation).then((shouldCalculatorRun: boolean) =>
    {
      if (!this.props.currentInformation.isValid())
      {
        return false;
      }

      return shouldCalculatorRun;
    });
  }
  updateRoiCalculatorOutput(roiCalculatorOutput: RoiCalculatorOutputModel): void
  {
    this.activeRoiModel.updateRoiCalculatorOutput(roiCalculatorOutput);
  }

  /* #endregion */




  private addRoiModelToInternalStore(roiModel: RoiModel): void
  {
    if (roiModel)
    {
      const key: string = roiModel.roiModelId.id.toString();

      this._activeRoiModelId = roiModel.roiModelId;
      this.store.set(key, roiModel);
    }
  }

  private getDefaultModelName(): string
  {
    const defaultRoiModelCount: number = this.getCountOfDefaultModels();
    return `${RoiModel.defaultProps.name} ${defaultRoiModelCount + 1}`;
  }

  private getCountOfDefaultModels(): number
  {
    let maxNumber: number = 0;

    for (let roiModel of this.store.values())
    {
      if (roiModel.name.startsWith(RoiModel.defaultProps.name))
      {
        const ordinalFromName: string = roiModel.name.replace(RoiModel.defaultProps.name, '').trim();
        const ordinal: number = (ordinalFromName.length === 0) ? 0 : parseInt(ordinalFromName);

        maxNumber = (ordinal > maxNumber) ? ordinal : maxNumber;
      }
    }

    return maxNumber;
  }

}
