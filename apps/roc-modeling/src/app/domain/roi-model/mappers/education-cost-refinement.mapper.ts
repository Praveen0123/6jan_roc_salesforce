import { IMapper, Result } from '@vantage-point/ddd-core';

import { EducationCostRefinement } from '../domain/education-costs.model';
import { EducationCostRefinementDto } from '../dtos';


export class EducationCostRefinementMapper implements IMapper<EducationCostRefinement, EducationCostRefinementDto>
{
  private constructor()
  {
  }

  public static create(): EducationCostRefinementMapper
  {
    return new EducationCostRefinementMapper();
  }

  toDTO(_input: EducationCostRefinement): EducationCostRefinementDto
  {
    throw new Error('Method not implemented.');
  }

  toDomain(_input: EducationCostRefinementDto): Result<EducationCostRefinement>
  {
    throw new Error('Method not implemented.');
  }

}
