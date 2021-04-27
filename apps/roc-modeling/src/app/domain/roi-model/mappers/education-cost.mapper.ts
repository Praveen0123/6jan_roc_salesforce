import { IncomeRangeEnum } from '@app/core/models';
import { IMapper, Result } from '@vantage-point/ddd-core';

import { EducationCost } from '../domain/education-costs.model';
import { EducationCostDto } from '../dtos';


export class EducationCostMapper implements IMapper<EducationCost, EducationCostDto>
{
  private constructor()
  {
  }

  public static create(): EducationCostMapper
  {
    return new EducationCostMapper();
  }

  toDTO(input: EducationCost): EducationCostDto
  {
    const educationCostDto: EducationCostDto =
    {
      institution: input.institution,
      startYear: input.startYear,
      incomeRange: input.incomeRange,
      isFulltime: input.isFulltime,
      yearsToCompleteDegree: input.yearsToCompleteDegree
    };

    return educationCostDto;
  }

  toDomain(input: EducationCostDto): Result<EducationCost>
  {
    return EducationCost.create
      (
        {
          institution: input?.institution ?? null,
          startYear: input?.startYear ?? null,
          incomeRange: IncomeRangeEnum.fromValue(input?.incomeRange.value),
          isFulltime: input?.isFulltime ?? null,
          yearsToCompleteDegree: input?.yearsToCompleteDegree ?? null
        }
      );
  }

}
