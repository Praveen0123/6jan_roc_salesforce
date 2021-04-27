import { IMapper, Result } from '@vantage-point/ddd-core';

import { EducationFinancing } from '../domain/education-financing.model';
import { EducationFinancingDto } from '../dtos';


export class EducationFinancingMapper implements IMapper<EducationFinancing, EducationFinancingDto>
{
  private constructor()
  {
  }

  public static create(): EducationFinancingMapper
  {
    return new EducationFinancingMapper();
  }

  toDTO(input: EducationFinancing): EducationFinancingDto
  {
    const educationFinancingDto: EducationFinancingDto =
    {
      isTaxDependent: input.isTaxDependent,
      prefersIncomeBasedRepayment: input.prefersIncomeBasedRepayment,
      outOfPocketExpensesByYear: input.outOfPocketExpensesByYear,
      federalSubsidizedLoanAmountByYear: input.federalSubsidizedLoanAmountByYear,
      federalUnsubsidizedLoanAmountByYear: input.federalUnsubsidizedLoanAmountByYear,
      federalLoanAmountByYear: input.federalLoanAmountByYear,
      privateLoanAmountByYear: input.privateLoanAmountByYear,
      pellGrantAidByYear: input.pellGrantAidByYear,
      yearsToPayOffFederalLoan: input.yearsToPayOffFederalLoan,
      yearsToPayOffPrivateLoan: input.yearsToPayOffPrivateLoan
    };

    return educationFinancingDto;
  }

  toDomain(input: EducationFinancingDto): Result<EducationFinancing>
  {
    return EducationFinancing.create
      (
        {
          isTaxDependent: input?.isTaxDependent ?? null,
          prefersIncomeBasedRepayment: input?.prefersIncomeBasedRepayment,
          outOfPocketExpensesByYear: input?.outOfPocketExpensesByYear ?? null,
          federalSubsidizedLoanAmountByYear: input?.federalSubsidizedLoanAmountByYear ?? null,
          federalUnsubsidizedLoanAmountByYear: input?.federalUnsubsidizedLoanAmountByYear ?? null,
          federalLoanAmountByYear: input?.federalLoanAmountByYear ?? null,
          privateLoanAmountByYear: input?.privateLoanAmountByYear ?? null,
          pellGrantAidByYear: input?.pellGrantAidByYear ?? null,
          yearsToPayOffFederalLoan: input?.yearsToPayOffFederalLoan ?? null,
          yearsToPayOffPrivateLoan: input?.yearsToPayOffPrivateLoan ?? null
        }
      );
  }

}
