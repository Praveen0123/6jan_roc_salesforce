import { CONFIG } from '@app/config/config';
import { Entity, Guard, Result } from '@vantage-point/ddd-core';


interface EducationFinancingProps
{
  isTaxDependent: boolean;
  prefersIncomeBasedRepayment: boolean;
  outOfPocketExpensesByYear: number[];
  federalSubsidizedLoanAmountByYear: number[];
  federalUnsubsidizedLoanAmountByYear: number[];
  federalLoanAmountByYear: number[];
  privateLoanAmountByYear: number[];
  pellGrantAidByYear: number[];
  yearsToPayOffFederalLoan: number;
  yearsToPayOffPrivateLoan: number;
}

export class EducationFinancing extends Entity<EducationFinancingProps>
{
  get isTaxDependent(): boolean
  {
    return this.props.isTaxDependent;
  }
  get prefersIncomeBasedRepayment(): boolean
  {
    return this.props.prefersIncomeBasedRepayment;
  }
  get outOfPocketExpensesByYear(): number[]
  {
    return this.props.outOfPocketExpensesByYear;
  }
  get federalSubsidizedLoanAmountByYear(): number[]
  {
    return this.props.federalSubsidizedLoanAmountByYear;
  }
  get federalUnsubsidizedLoanAmountByYear(): number[]
  {
    return this.props.federalUnsubsidizedLoanAmountByYear;
  }
  get federalLoanAmountByYear(): number[]
  {
    return this.props.federalLoanAmountByYear;
  }
  get privateLoanAmountByYear(): number[]
  {
    return this.props.privateLoanAmountByYear;
  }
  get pellGrantAidByYear(): number[]
  {
    return this.props.pellGrantAidByYear;
  }
  get yearsToPayOffFederalLoan(): number
  {
    return this.props.yearsToPayOffFederalLoan;
  }
  get yearsToPayOffPrivateLoan(): number
  {
    return this.props.yearsToPayOffPrivateLoan;
  }


  private constructor(props: EducationFinancingProps)
  {
    super(props);
  }

  static create(props: EducationFinancingProps): Result<EducationFinancing>
  {
    const propsResult = Guard.againstNullOrUndefinedBulk(
      [
      ]);

    if (!propsResult.succeeded)
    {
      return Result.failure<EducationFinancing>(propsResult.message || 'education financing properties error');
    }

    const careerGoal = new EducationFinancing
      (
        {
          ...props,
          isTaxDependent: props.isTaxDependent ?? EducationFinancing.defaultProps.isTaxDependent,
          prefersIncomeBasedRepayment: props.prefersIncomeBasedRepayment ?? EducationFinancing.defaultProps.prefersIncomeBasedRepayment,
          outOfPocketExpensesByYear: props.outOfPocketExpensesByYear ?? EducationFinancing.defaultProps.outOfPocketExpensesByYear,
          federalSubsidizedLoanAmountByYear: props.federalSubsidizedLoanAmountByYear ?? EducationFinancing.defaultProps.federalSubsidizedLoanAmountByYear,
          federalUnsubsidizedLoanAmountByYear: props.federalUnsubsidizedLoanAmountByYear ?? EducationFinancing.defaultProps.federalUnsubsidizedLoanAmountByYear,
          federalLoanAmountByYear: props.federalLoanAmountByYear ?? EducationFinancing.defaultProps.federalLoanAmountByYear,
          privateLoanAmountByYear: props.privateLoanAmountByYear ?? EducationFinancing.defaultProps.privateLoanAmountByYear,
          pellGrantAidByYear: props.pellGrantAidByYear ?? EducationFinancing.defaultProps.pellGrantAidByYear,
          yearsToPayOffFederalLoan: props.yearsToPayOffFederalLoan ?? EducationFinancing.defaultProps.yearsToPayOffFederalLoan,
          yearsToPayOffPrivateLoan: props.yearsToPayOffPrivateLoan ?? EducationFinancing.defaultProps.yearsToPayOffPrivateLoan
        }
      );

    return Result.success<EducationFinancing>(careerGoal);
  }

  static get defaultProps(): EducationFinancingProps
  {
    const props: EducationFinancingProps =
    {
      isTaxDependent: true,
      prefersIncomeBasedRepayment: false,
      outOfPocketExpensesByYear: null,
      federalSubsidizedLoanAmountByYear: [0],
      federalUnsubsidizedLoanAmountByYear: [0],
      federalLoanAmountByYear: [0],
      privateLoanAmountByYear: [0],
      pellGrantAidByYear: [0],
      yearsToPayOffFederalLoan: CONFIG.EDUCATION_FINANCING.DEFAULT_PAY_OFF_FEDERAL_LOAN_IN_YEARS,
      yearsToPayOffPrivateLoan: CONFIG.EDUCATION_FINANCING.DEFAULT_PAY_OFF_PRIVATE_LOAN_IN_YEARS
    };

    return props;
  }


  updateOutOfPocketExpensesByYear(outOfPocketExpensesByYear: number[])
  {
    this.props.outOfPocketExpensesByYear = outOfPocketExpensesByYear;
  }

  clearEducationFinancing()
  {
    this.props.prefersIncomeBasedRepayment = false;
    this.props.outOfPocketExpensesByYear = null;
    this.props.federalSubsidizedLoanAmountByYear = [0];
    this.props.federalUnsubsidizedLoanAmountByYear = [0];
    this.props.federalLoanAmountByYear = [0];
    this.props.privateLoanAmountByYear = [0];
    this.props.pellGrantAidByYear = [0];
    this.props.yearsToPayOffFederalLoan = CONFIG.EDUCATION_FINANCING.DEFAULT_PAY_OFF_FEDERAL_LOAN_IN_YEARS;
    this.props.yearsToPayOffPrivateLoan = CONFIG.EDUCATION_FINANCING.DEFAULT_PAY_OFF_PRIVATE_LOAN_IN_YEARS;
  }
}
