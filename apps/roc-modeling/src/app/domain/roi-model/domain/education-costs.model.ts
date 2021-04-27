import { CONFIG } from '@app/config/config';
import { IncomeRangeEnum, LivingConditionTypeEnum, ResidencyTypeEnum } from '@app/core/models';
import { Institution } from '@gql';
import { Entity, Guard, Result } from '@vantage-point/ddd-core';

export interface EducationCostProps
{
  institution: Institution;
  startYear: number;
  incomeRange: IncomeRangeEnum;
  isFulltime: boolean;
  yearsToCompleteDegree: number;
}

export class EducationCost extends Entity<EducationCostProps>
{
  get institution(): Institution
  {
    return this.props.institution;
  }
  get institutionName(): string
  {
    return this.props.institution.name;
  }
  get startYear(): number
  {
    return this.props.startYear;
  }
  get incomeRange(): IncomeRangeEnum
  {
    return this.props.incomeRange;
  }
  get isFulltime(): boolean
  {
    return this.props.isFulltime;
  }
  get yearsToCompleteDegree(): number
  {
    return this.props.yearsToCompleteDegree;
  }


  private constructor(props: EducationCostProps)
  {
    super(props);
  }

  static create(props: EducationCostProps): Result<EducationCost>
  {
    const propsResult = Guard.againstNullOrUndefinedBulk([
      // { argument: props.institution, argumentName: 'institution' },
      // { argument: props.startYear, argumentName: 'start year' }
    ]);

    if (!propsResult.succeeded)
    {
      return Result.failure<EducationCost>(propsResult.message || 'education cost properties error');
    }

    const careerGoal = new EducationCost
      (
        {
          ...props,
          startYear: props.startYear ?? EducationCost.defaultProps.startYear,
          incomeRange: props.incomeRange ?? EducationCost.defaultProps.incomeRange,
          isFulltime: props.isFulltime ?? EducationCost.defaultProps.isFulltime,
          yearsToCompleteDegree: props.yearsToCompleteDegree ?? EducationCost.defaultProps.yearsToCompleteDegree
        }
      );

    return Result.success<EducationCost>(careerGoal);
  }

  static get defaultProps(): EducationCostProps
  {
    const props: EducationCostProps =
    {
      institution: null,
      startYear: new Date().getFullYear(),
      incomeRange: IncomeRangeEnum.UNKNOWN,
      isFulltime: true,
      yearsToCompleteDegree: CONFIG.EDUCATION_COST.YEARS_TO_COMPLETE_DEFAULT
    };

    return props;
  }


  updateYearsToCompleteDegree(yearsToComplete: number)
  {
    this.props.yearsToCompleteDegree = yearsToComplete;
  }

  getGrantOrScholarshipAidExcludingPellGrant(): number
  {
    const aidInfo = this.props.institution?.avgGrantScholarshipAidInfo;

    if (!aidInfo)
    {
      return 0;
    }

    return aidInfo.federalGrants.otherFederalGrants.avgAmountAidReceived ?? 0
      + aidInfo.stateLocalGovtGrantOrScholarships.avgAmountAidReceived ?? 0
      + aidInfo.institutionalGrantsOrScholarships.avgAmountAidReceived ?? 0;
  }

  setInstitution(institution: Institution)
  {
    this.props.institution = institution;
  }

  setStartSchoolYear(startYear?: number)
  {
    this.props.startYear = startYear ?? new Date().getFullYear();
  }

  setPartTimeFullTime(isFulltime?: boolean)
  {
    this.props.isFulltime = isFulltime ?? true;
  }

  setYearsToComplete(yearsToCompleteDegree?: number)
  {
    this.props.yearsToCompleteDegree = yearsToCompleteDegree ?? CONFIG.EDUCATION_COST.YEARS_TO_COMPLETE_DEFAULT;
  }

  isValid(): boolean
  {
    const hasInstitution: boolean = this.props.institution !== null && this.props.institution !== undefined;
    const hasStartYear: boolean = this.props.startYear !== null && this.props.startYear !== undefined;
    const hasIncomeRange: boolean = this.props.incomeRange !== null && this.props.incomeRange !== undefined;

    return hasInstitution && hasStartYear && hasIncomeRange;
  }
}



/* #region  EDUCATION COST REFINEMENTS */

export interface EducationCostRefinement
{
  residencyType: ResidencyTypeEnum;
  livingConditionTypeEnum: LivingConditionTypeEnum;
  costOfAttendance: CostOfAttendance;
  grantsAndScholarships: GrantsAndScholarships;
  expectedFamilyContribution: number;
}
export interface CostOfAttendance
{
  tuitionAndFees: number;
  booksAndSupplies: number;
  roomAndBoard: number;
  otherExpenses: number;
}
export interface GrantsAndScholarships
{
  federalPellGrant: number;
  otherFederalGrants: number;
  stateOrLocalGrants: number;
  institutionalGrants: number;
  otherGrants: number;
  giBillBenefits: number;
  dodTuitionAssistance: number;
}

/* #endregion */
