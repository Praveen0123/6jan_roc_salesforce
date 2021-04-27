import { CONFIG } from '@app/config/config';
import { EducationLevelEnum, LivingConditionTypeEnum, ResidencyTypeEnum } from '@app/core/models';
import { Institution, InstructionalProgram, Location, Occupation } from '@gql';
import { Entity, Guard, Result, UniqueEntityID } from '@vantage-point/ddd-core';
import hash from 'object-hash';

import { CareerGoalDto, EducationCostDto, EducationFinancingDto } from '../dtos';
import { CareerGoalMapper } from '../mappers/career-goal.mapper';
import { EducationCostMapper } from '../mappers/education-cost.mapper';
import { EducationFinancingMapper } from '../mappers/education-financing.mapper';
import { RoiCalculatorInput, RoiCalculatorOutputModel } from '../models';
import { CareerGoal } from './career-goal.model';
import { CurrentInformation } from './current-information.model';
import { EducationCost, EducationCostRefinement } from './education-costs.model';
import { EducationFinancing } from './education-financing.model';
import * as loanCalculator from './loan-calculator';
import { RoiModelId } from './roi-model-id';


export interface RoiModelProps
{
  name: string;
  careerGoal?: CareerGoal;
  educationCost?: EducationCost;
  educationCostRefinement?: EducationCostRefinement;
  educationFinancing?: EducationFinancing;
  radiusInMiles?: number;
  dateCreated: Date;
  lastUpdated: Date;
}

export class RoiModel extends Entity<RoiModelProps>
{
  private _roiModelId: RoiModelId;
  private _roiCalculatorInput: RoiCalculatorInput;
  private _roiCalculatorInputHash: string;
  private _roiCalculatorOutput: RoiCalculatorOutputModel;

  get roiModelId(): RoiModelId
  {
    return this._roiModelId;
  }
  get name(): string
  {
    return this.props.name;
  }
  get careerGoal(): CareerGoal
  {
    return this.props.careerGoal;
  }
  get educationCost(): EducationCost
  {
    return this.props.educationCost;
  }
  get educationCostRefinement(): EducationCostRefinement
  {
    return this.props.educationCostRefinement;
  }
  get educationFinancing(): EducationFinancing
  {
    return this.props.educationFinancing;
  }
  get roiCalculatorInput(): RoiCalculatorInput
  {
    return this._roiCalculatorInput;
  }
  get hash(): string
  {
    return this._roiCalculatorInputHash;
  }
  get roiCalculatorOutput(): RoiCalculatorOutputModel
  {
    return this._roiCalculatorOutput;
  }
  get radiusInMiles(): number
  {
    return this.props.radiusInMiles;
  }
  get dateCreated(): Date
  {
    return this.props.dateCreated;
  }
  get lastUpdated(): Date
  {
    return this.props.lastUpdated;
  }
  get yearsToCompleteDegree(): number
  {
    return this.props.educationCost?.yearsToCompleteDegree ?? CONFIG.EDUCATION_COST.YEARS_TO_COMPLETE_DEFAULT;
  }
  get fullTimeStudentPercent(): number
  {
    return (this.props.educationCost?.isFulltime ?? true) ? 1 : 0.5;
  }

  private constructor(props: RoiModelProps, id?: UniqueEntityID)
  {
    super(props, id);

    this._roiModelId = RoiModelId.create(this._id);
  }

  static create(props: RoiModelProps, id?: UniqueEntityID): Result<RoiModel>
  {
    const propsResult = Guard.againstNullOrUndefinedBulk([]);

    if (!propsResult.succeeded)
    {
      return Result.failure<RoiModel>(
        propsResult.message || 'roi model properties error'
      );
    }

    const roiModel = new RoiModel
      (
        {
          ...props,
          name: props.name ?? RoiModel.defaultProps.name,
          radiusInMiles: props.radiusInMiles ?? RoiModel.defaultProps.radiusInMiles,
          dateCreated: props.dateCreated ?? RoiModel.defaultProps.dateCreated,
          lastUpdated: props.lastUpdated ?? RoiModel.defaultProps.lastUpdated,
        },
        id
      );

    return Result.success<RoiModel>(roiModel);
  }

  static get defaultProps(): RoiModelProps
  {
    const careerGoalOrError: Result<CareerGoal> = CareerGoal.create(CareerGoal.defaultProps);
    const educationCostOrError: Result<EducationCost> = EducationCost.create(EducationCost.defaultProps);
    const educationFinancingOrError: Result<EducationFinancing> = EducationFinancing.create(EducationFinancing.defaultProps);

    const props: RoiModelProps =
    {
      name: 'Default ROI Model',
      careerGoal: (careerGoalOrError.isSuccess) ? careerGoalOrError.getValue() : null,
      educationCost: (educationCostOrError.isSuccess) ? educationCostOrError.getValue() : null,
      educationCostRefinement: null,
      educationFinancing: (educationFinancingOrError.isSuccess) ? educationFinancingOrError.getValue() : null,
      radiusInMiles: CONFIG.USER_PROFILE.RADIUS_IN_MILES,
      dateCreated: new Date(),
      lastUpdated: new Date()
    };

    return props;
  }


  updateRoiModelName(name: string)
  {
    this.props.name = name;
  }



  /* #region CAREER GOAL */

  isCareerGoalValid(): boolean
  {
    return this.props.careerGoal?.isValid() ?? false;
  }

  updateCareerGoal(careerGoalDto: CareerGoalDto): void
  {
    const successOrError: Result<CareerGoal> = CareerGoalMapper.create().toDomain(
      careerGoalDto
    );

    if (successOrError.isSuccess)
    {
      this.props.careerGoal = successOrError.getValue();

      // SEED EDUCATION LEVEL WITH OCCUPATION'S TYPICAL EDUCATION LEVEL
      if (this.props.careerGoal?.occupation?.typicalEducationLevelGroupId)
      {
        const defaultEducationLevelEnum: EducationLevelEnum = EducationLevelEnum.getEducationLevelByGroupId
          (
            this.props.careerGoal?.occupation?.typicalEducationLevelGroupId
          );

        this.props.careerGoal.updateEducationLevelEnum(defaultEducationLevelEnum);
      }


      // SEED NUMBER OF YEARS TO COMPLETE DEGREE BASED ON DESIRED EDUCATION LEVEL
      let yearsOfCollege = CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_BACHELORS_DEGREE;
      switch (this.props.careerGoal.degreeLevel)
      {
        case EducationLevelEnum.NinthGradeStudent:
        case EducationLevelEnum.TenthGradeStudent:
        case EducationLevelEnum.EleventhGradeStudent:
        case EducationLevelEnum.TwelfthDegreeStudent:
        case EducationLevelEnum.HighSchoolGraduate:
          yearsOfCollege = CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_HIGH_SCHOOL;
          break;
        case EducationLevelEnum.AssociatesDegree:
          yearsOfCollege = CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_ASSOCIATES_DEGREE;
          break;
        case EducationLevelEnum.BachelorsDegree:
          yearsOfCollege = CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_BACHELORS_DEGREE;
          break;
        case EducationLevelEnum.MastersDegree:
          yearsOfCollege = CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_MASTERS_DEGREE;
          break;
        case EducationLevelEnum.DoctorateDegree:
          yearsOfCollege = CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_DOCTORATE_DEGREE;
          break;
        default:
          yearsOfCollege = CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_BACHELORS_DEGREE;
      }
      this.props.educationCost.updateYearsToCompleteDegree(yearsOfCollege);


      this.setLastUpdated();
    }
    else
    {
      throw successOrError.getError();
    }
  }

  setCareerGoalLocation(location: Location)
  {
    this.props.careerGoal.setLocation(location);
  }

  setCareerGoalOccupation(occupation: Occupation)
  {
    this.props.careerGoal.setOccupation(occupation);
  }

  setCareerGoalDegreeLevel(degreeLevel: EducationLevelEnum)
  {
    this.props.careerGoal.setDegreeLevel(degreeLevel);
  }

  setCareerGoalDegreeProgram(degreeProgram: InstructionalProgram)
  {
    this.props.careerGoal.setDegreeProgram(degreeProgram);
  }

  setCareerGoalRetirementAge(retirementAge: number)
  {
    this.props.careerGoal.setRetirementAge(retirementAge);
  }

  /* #endregion */



  /* #region  EDUCATION COST */

  isEducationCostValid(): boolean
  {
    return this.props.educationCost?.isValid() ?? false;
  }

  updateEducationCost(educationCostDto: EducationCostDto, currentInformation: CurrentInformation): void
  {
    const successOrError: Result<EducationCost> = EducationCostMapper.create().toDomain(educationCostDto);

    if (successOrError.isSuccess)
    {
      this.props.educationCost = successOrError.getValue();

      // CALCULATE DEFAULT OUT OF POCKET AMOUNT BASED ON INSTITUTION AND NUMBER OF YEARS TO COMPLETE DEGREE
      const outOfPocketExpensesByYear: number[] = this.getOutOfPocketExpensesByYear(currentInformation);
      this.props.educationFinancing.updateOutOfPocketExpensesByYear(outOfPocketExpensesByYear);

      if (this.props.name === RoiModel.defaultProps.name)
      {
        this.updateRoiModelName(this.props.educationCost.institutionName);
      }

      this.setLastUpdated();
    }
    else
    {
      throw successOrError.getError();
    }
  }

  setEducationCostInstitution(institution: Institution)
  {
    this.props.educationCost.setInstitution(institution);
  }

  setEducationCostStartSchoolYear(startYear: number)
  {
    this.props.educationCost.setStartSchoolYear(startYear);
  }

  setEducationCostPartTimeFullTime(isFulltime: boolean)
  {
    this.props.educationCost.setPartTimeFullTime(isFulltime);
  }

  setEducationCostYearsToComplete(yearsToCompleteDegree: number)
  {
    this.props.educationCost.setYearsToComplete(yearsToCompleteDegree);
  }

  /* #endregion */



  /* #region  EDUCATION FINANCING */

  updateEducationFinancing(educationFinancingDto: EducationFinancingDto): void
  {
    const successOrError: Result<EducationFinancing> = EducationFinancingMapper.create().toDomain(educationFinancingDto);

    if (successOrError.isSuccess)
    {
      this.props.educationFinancing = successOrError.getValue();

      this.setLastUpdated();
    }
    else
    {
      throw successOrError.getError();
    }
  }

  clearEducationFinancing()
  {
    this.props.educationFinancing.clearEducationFinancing();
  }

  /* #endregion */



  /* #region  INPUT/OUTPUT */

  calculateRoiCalculatorInput
    (
      currentInformation: CurrentInformation
    ): Promise<boolean>
  {
    const startingYearDelay: number = this.getStartingYearDelay(currentInformation);

    return new Promise(async (resolve, reject) =>
    {
      try
      {
        const careerGoal: CareerGoal = this.props.careerGoal;
        const educationCost: EducationCost = this.props.educationCost;
        const educationFinancing: EducationFinancing = this.props.educationFinancing;
        const endDegreeLevel: number =
          careerGoal.degreeLevel?.value && careerGoal.degreeLevel.value > 0
            ? careerGoal.degreeLevel.value
            : 0;
        const goalStateOnetCode: string[] = careerGoal.occupation?.onetCode
          ? [careerGoal.occupation.onetCode]
          : [];
        const startDegreeLevel: number =
          currentInformation.educationLevel?.value &&
            currentInformation.educationLevel.value > 0
            ? currentInformation.educationLevel.value
            : 0;

        const tuitionAndFeesInfo = this.tuitionAndFeesInfo();
        // const booksAndSupplies = this.booksAndSuppliesInfo();
        const roomAndBoardInfo = this.roomAndBoardInfo();
        // const otherLivingExpensesInfo = this.otherLivingExpensesInfo();

        const outOfPocketExpensesByYear: number[] = this.getOutOfPocketExpensesByYear(currentInformation);

        const currentStateOnetCode: string[] = (currentInformation.occupation && currentInformation.occupation.onetCode) ? [currentInformation.occupation.onetCode] : [];

        const roiCalculatorInput: RoiCalculatorInput =
        {
          currentZipCode: currentInformation.location?.zipCode,
          goalZipCode: careerGoal.location?.zipCode ?? currentInformation.location?.zipCode,
          distance: this.props.radiusInMiles,
          currentStateOnetCode: currentStateOnetCode,
          currentStateOccupationTitle: currentInformation.occupation?.title,
          goalStateOnetCode: goalStateOnetCode,
          goalStateOccupationTitle: careerGoal.occupation?.title,
          startDegreeLevel: startDegreeLevel,
          endDegreeLevel: endDegreeLevel,
          yearsOfCollege: this.yearsToCompleteDegree,
          yearsToRetirement: Math.max(careerGoal.retirementAge - currentInformation.currentAge, 1),
          tuitionAndFees: tuitionAndFeesInfo.expenseAmount,
          tuitionAndFeesRaise: tuitionAndFeesInfo.percentChangeFromLastYear,
          livingArrangementCost: roomAndBoardInfo.expenseAmount,
          livingArrangementCostRaise: roomAndBoardInfo.percentChangeFromLastYear,
          independent: !educationFinancing.isTaxDependent,
          ibrFederal: educationFinancing.prefersIncomeBasedRepayment,
          monthsToPayoffFederalLoan: educationFinancing.yearsToPayOffFederalLoan * 12,
          monthsToPayoffPrivateLoan: educationFinancing.yearsToPayOffPrivateLoan * 12,
          annualExpenseFromSavings: outOfPocketExpensesByYear,
          efc: null,
          participation: educationCost.isFulltime ? 1 : 0.5,
          workDuringStudy: false,
          ipedsGraduationTimeFactor: [1.0, 1.5, 2.0],
          ipedsGraduationProbability: [1.0, 1.0, 1.0],
          ipedsRetentionRate: [1.0, 1.0, 1.0],
          grantOrScholarshipAidExcludingPellGrant: educationCost.getGrantOrScholarshipAidExcludingPellGrant(),
          startingYearDelay: startingYearDelay,
          noLoans: false
        };

        const newHash: string = this.toHash(roiCalculatorInput);

        if (newHash !== this._roiCalculatorInputHash)
        {
          this._roiCalculatorInputHash = newHash;
          this._roiCalculatorInput = roiCalculatorInput;
          resolve(true);
        }

        resolve(false);
      }
      catch (error)
      {
        reject(error);
      }
    });
  }

  updateRoiCalculatorOutput
    (
      roiCalculatorOutput: RoiCalculatorOutputModel
    ): void
  {
    this._roiCalculatorOutput = roiCalculatorOutput;
  }

  /* #endregion */



  /* #region  CALCULATIONS  */

  tuitionAndFeesInfo(): { expenseAmount: number, percentChangeFromLastYear: number; }
  {
    // default to in-state if residencyType null or UNKNOWN
    const tuitionAndFeesInfo = this.props.educationCost?.institution?.costOfAttendanceInfo.tuitionAndFees;
    const residencyType = this.props.educationCostRefinement?.residencyType ?? ResidencyTypeEnum.IN_STATE;
    let tuitionAndFees = 0;
    let tuitionAndFeesRaise = 0;

    if (tuitionAndFeesInfo)
    {
      switch (residencyType)
      {
        case ResidencyTypeEnum.UNKNOWN:
        case ResidencyTypeEnum.IN_STATE:
          tuitionAndFees = tuitionAndFeesInfo.inState.expenseAmount;
          tuitionAndFeesRaise = tuitionAndFeesInfo.inState.percentChangeFromLastYear;
          break;
        case ResidencyTypeEnum.IN_DISTRICT:
          tuitionAndFees = tuitionAndFeesInfo.inDistrict.expenseAmount;
          tuitionAndFeesRaise = tuitionAndFeesInfo.inDistrict.percentChangeFromLastYear;
          break;
        case ResidencyTypeEnum.OUT_STATE:
          tuitionAndFees = tuitionAndFeesInfo.outOfState.expenseAmount;
          tuitionAndFeesRaise = tuitionAndFeesInfo.outOfState.percentChangeFromLastYear;
          break;
        default:
          tuitionAndFees = tuitionAndFeesInfo.inState.expenseAmount;
          tuitionAndFeesRaise = tuitionAndFeesInfo.inState.percentChangeFromLastYear;
          break;
      }

      // if falsey values, fall ball to other residency values
      if (!tuitionAndFees)
      {
        tuitionAndFees = tuitionAndFeesInfo.inDistrict.expenseAmount
          ?? tuitionAndFeesInfo.inState.expenseAmount
          ?? tuitionAndFeesInfo.inState.expenseAmount
          ?? 0;
      }
      if (!tuitionAndFeesRaise)
      {
        tuitionAndFeesRaise = tuitionAndFeesInfo.inDistrict.percentChangeFromLastYear
          ?? tuitionAndFeesInfo.inState.percentChangeFromLastYear
          ?? tuitionAndFeesInfo.inState.percentChangeFromLastYear
          ?? 0;
      }
    }

    return { expenseAmount: tuitionAndFees, percentChangeFromLastYear: tuitionAndFeesRaise / 100 };
  }
  booksAndSuppliesInfo(): { expenseAmount: number, percentChangeFromLastYear: number; }
  {
    const booksAndSuppliesInfo = this.props.educationCost?.institution?.costOfAttendanceInfo.booksAndSupplies;
    return { expenseAmount: booksAndSuppliesInfo?.expenseAmount ?? 0, percentChangeFromLastYear: (booksAndSuppliesInfo?.percentChangeFromLastYear ?? 0) / 100 };
  }
  roomAndBoardInfo(): { expenseAmount: number, percentChangeFromLastYear: number; }
  {
    // default to on campus if livingConditionType null or UNKNOWN
    const livingArrangementCostInfo = this.props.educationCost?.institution?.costOfAttendanceInfo.livingArrangement;
    const livingConditionType = this.props.educationCostRefinement?.livingConditionTypeEnum ?? LivingConditionTypeEnum.ON_CAMPUS;
    let roomAndBoardCost = 0;
    let roomAndBoardCostRaise = 0;

    if (livingArrangementCostInfo)
    {
      switch (livingConditionType)
      {
        case LivingConditionTypeEnum.UNKNOWN:
        case LivingConditionTypeEnum.ON_CAMPUS:
          roomAndBoardCost = livingArrangementCostInfo.onCampus.roomAndBoard.expenseAmount;
          roomAndBoardCostRaise = livingArrangementCostInfo.onCampus.roomAndBoard.percentChangeFromLastYear;
          break;
        case LivingConditionTypeEnum.OFF_CAMPUS_NOT_WITH_FAMILY:
          roomAndBoardCost = livingArrangementCostInfo.offCampusNotWithFamily.roomAndBoard.expenseAmount;
          roomAndBoardCostRaise = livingArrangementCostInfo.offCampusNotWithFamily.roomAndBoard.percentChangeFromLastYear;
          break;
        case LivingConditionTypeEnum.OFF_CAMPUS_WITH_FAMILY:
          roomAndBoardCost = 0;
          roomAndBoardCostRaise = 0;
          break;
        default:
          roomAndBoardCost = livingArrangementCostInfo.onCampus.roomAndBoard.expenseAmount;
          roomAndBoardCostRaise = livingArrangementCostInfo.onCampus.roomAndBoard.percentChangeFromLastYear;
          break;
      }

      // if falsey values, fall ball to other residency values
      if (!roomAndBoardCost)
      {
        roomAndBoardCost = livingArrangementCostInfo.onCampus.roomAndBoard.expenseAmount
          ?? livingArrangementCostInfo.offCampusNotWithFamily.roomAndBoard.expenseAmount
          ?? 0;
      }
      if (!roomAndBoardCostRaise)
      {
        roomAndBoardCostRaise = livingArrangementCostInfo.onCampus.roomAndBoard.percentChangeFromLastYear
          ?? livingArrangementCostInfo.offCampusNotWithFamily.roomAndBoard.percentChangeFromLastYear
          ?? 0;
      }
    }

    return { expenseAmount: roomAndBoardCost, percentChangeFromLastYear: roomAndBoardCostRaise / 100 };
  }
  otherLivingExpensesInfo(): { expenseAmount: number, percentChangeFromLastYear: number; }
  {
    // default to on campus if livingConditionType null or UNKNOWN
    const livingArrangementCostInfo = this.props.educationCost?.institution?.costOfAttendanceInfo.livingArrangement;
    const livingConditionType = this.props.educationCostRefinement?.livingConditionTypeEnum ?? LivingConditionTypeEnum.ON_CAMPUS;
    let otherLivingExpenses = 0;
    let otherLivingExpensesRaise = 0;

    if (livingArrangementCostInfo)
    {
      switch (livingConditionType)
      {
        case LivingConditionTypeEnum.UNKNOWN:
        case LivingConditionTypeEnum.ON_CAMPUS:
          otherLivingExpenses = livingArrangementCostInfo.onCampus.otherExpenses.expenseAmount;
          otherLivingExpensesRaise = livingArrangementCostInfo.onCampus.otherExpenses.percentChangeFromLastYear;
          break;
        case LivingConditionTypeEnum.OFF_CAMPUS_NOT_WITH_FAMILY:
          otherLivingExpenses = livingArrangementCostInfo.offCampusNotWithFamily.otherExpenses.expenseAmount;
          otherLivingExpensesRaise = livingArrangementCostInfo.offCampusNotWithFamily.otherExpenses.percentChangeFromLastYear;
          break;
        case LivingConditionTypeEnum.OFF_CAMPUS_WITH_FAMILY:
          otherLivingExpenses = livingArrangementCostInfo.offCampusWithFamily.otherExpenses.expenseAmount;
          otherLivingExpensesRaise = livingArrangementCostInfo.offCampusWithFamily.otherExpenses.percentChangeFromLastYear;
          break;
        default:
          otherLivingExpenses = livingArrangementCostInfo.onCampus.otherExpenses.expenseAmount;
          otherLivingExpensesRaise = livingArrangementCostInfo.onCampus.otherExpenses.percentChangeFromLastYear;
          break;
      }

      // if falsey values, fall ball to other residency values
      if (!otherLivingExpenses)
      {
        otherLivingExpenses = livingArrangementCostInfo.onCampus.otherExpenses.expenseAmount
          ?? livingArrangementCostInfo.offCampusNotWithFamily.otherExpenses.expenseAmount
          ?? livingArrangementCostInfo.offCampusWithFamily.otherExpenses.expenseAmount
          ?? 0;
      }
      if (!otherLivingExpensesRaise)
      {
        otherLivingExpensesRaise = livingArrangementCostInfo.onCampus.otherExpenses.percentChangeFromLastYear
          ?? livingArrangementCostInfo.offCampusNotWithFamily.otherExpenses.percentChangeFromLastYear
          ?? livingArrangementCostInfo.offCampusWithFamily.otherExpenses.percentChangeFromLastYear
          ?? 0;
      }
    }

    return { expenseAmount: otherLivingExpenses, percentChangeFromLastYear: otherLivingExpensesRaise / 100 };
  }
  getCostOfAttendanceByYear(currentInformation: CurrentInformation): number[]
  {
    const tuitionAndFeesInfo = this.tuitionAndFeesInfo();
    const booksAndSuppliesInfo = this.booksAndSuppliesInfo();
    const roomAndBoardInfo = this.roomAndBoardInfo();
    const otherLivingExpensesInfo = this.otherLivingExpensesInfo();
    const startingYearDelay: number = this.getStartingYearDelay(currentInformation);

    const costOfAttendanceByYear = loanCalculator.getCostOfAttendanceByYear
      (
        {
          tuitionAndFees: tuitionAndFeesInfo.expenseAmount,
          tuitionAndFeesRaise: tuitionAndFeesInfo.percentChangeFromLastYear,
          booksAndSupplies: booksAndSuppliesInfo.expenseAmount,
          booksAndSuppliesRaise: booksAndSuppliesInfo.percentChangeFromLastYear,
          roomAndBoard: roomAndBoardInfo.expenseAmount,
          roomAndBoardRaise: roomAndBoardInfo.percentChangeFromLastYear,
          otherLivingExpenses: otherLivingExpensesInfo.expenseAmount,
          otherLivingExpensesRaise: otherLivingExpensesInfo.percentChangeFromLastYear
        },
        this.yearsToCompleteDegree, startingYearDelay
      );

    return costOfAttendanceByYear;
  }
  getCumulativeCostOfAttendance(currentInformation: CurrentInformation): number
  {
    return this.getCostOfAttendanceByYear(currentInformation).reduce((p, c) => p + c, 0);
  }
  getGrantOrScholarshipAidExcludingPellGrant(): number
  {
    return this.props.educationCost.getGrantOrScholarshipAidExcludingPellGrant();
  }
  getStartingYearDelay(currentInformation: CurrentInformation): number
  {
    const currentEducationLevelValue = currentInformation.educationLevel?.value ?? 0;
    const currentYear = new Date().getFullYear();
    const educationCostStartYear = this.educationCost?.startYear ?? currentYear;
    const educationCostYearsToWait = currentYear - educationCostStartYear;

    let startingYearDelay = 0;

    if (currentEducationLevelValue < 0)
    {
      startingYearDelay = Math.abs(currentEducationLevelValue);
    }

    if (educationCostYearsToWait > startingYearDelay && educationCostYearsToWait > 0)
    {
      startingYearDelay = educationCostYearsToWait;
    }

    return startingYearDelay;
  }
  getEfc(): number
  {
    let efc = this.props.educationCostRefinement?.expectedFamilyContribution;
    const incomeRange = this.props.educationCost?.incomeRange;

    // if efc field is null but family income range has been set, use income range as estimate
    if ((efc == null || efc === undefined) && incomeRange)
    {
      efc = null;
      let estimatedEfc: number;
      switch (incomeRange)
      {
        // case IncomeRangeEnum.From_0_To_30000:
        //   estimatedEfc = 0;
        //   break;
        // case IncomeRangeEnum.From_30001_To_48000:
        //   estimatedEfc = 3000;
        //   break;
        // case IncomeRangeEnum.From_48001_To_75000:
        //   estimatedEfc = 7000;
        //   break;
        // case IncomeRangeEnum.From_75001_To_110000:
        //   estimatedEfc = 100000;
        //   break;
        // case IncomeRangeEnum.From_110001_Or_More:
        //   estimatedEfc = 1000000;
        //   break;
        default:
          estimatedEfc = 3500;
      }
      efc = estimatedEfc;
    }

    return efc;
  }
  getPellGrantAidByYear(currentInformation: CurrentInformation): number[]
  {
    const efc = this.getEfc();
    const costOfAttendanceByYear = this.getCostOfAttendanceByYear(currentInformation);
    const yearsToCompleteDegree = this.yearsToCompleteDegree;
    const pellGrantAidByYearResult = loanCalculator.getPellGrantAidByYear(efc, this.fullTimeStudentPercent, costOfAttendanceByYear, yearsToCompleteDegree);

    return pellGrantAidByYearResult;
  };
  getNetPriceByYear(currentInformation: CurrentInformation): number[]
  {
    const costOfAttendanceByYear = this.getCostOfAttendanceByYear(currentInformation);
    const pellGrantAidByYear = this.getPellGrantAidByYear(currentInformation);
    const grantOrScholarshipAidExcludingPellGrant = this.getGrantOrScholarshipAidExcludingPellGrant();

    return loanCalculator.getNetPriceByYear(costOfAttendanceByYear, grantOrScholarshipAidExcludingPellGrant, pellGrantAidByYear, this.yearsToCompleteDegree);
  };
  getLoanLimitsInfo(): loanCalculator.LoanLimitsInfo
  {
    return loanCalculator.getLoanLimitsInfo(!this.props.educationFinancing.isTaxDependent, this.yearsToCompleteDegree);
  }
  getOutOfPocketExpensesByYear(currentInformation: CurrentInformation): number[]
  {
    const yearsToCompleteDegree = this.yearsToCompleteDegree;
    const institution = this.educationCost.institution;

    if (yearsToCompleteDegree > 0 && institution)
    {
      if (this.educationFinancing?.outOfPocketExpensesByYear?.length)
      {
        return this.educationFinancing.outOfPocketExpensesByYear;
      }
      else
      {
        return this.getNetPriceByYear(currentInformation);
      }
    }

    return [0];
  }

  /* #endregion */




  private setLastUpdated(): void
  {
    this.props.lastUpdated = new Date();
  }

  private toHash(roiCalculatorInput: RoiCalculatorInput): string
  {
    return hash(roiCalculatorInput);
  }
}
