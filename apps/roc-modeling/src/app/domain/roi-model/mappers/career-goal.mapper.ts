import { IMapper, Result } from '@vantage-point/ddd-core';

import { CareerGoal } from '../domain/career-goal.model';
import { CareerGoalDto } from '../dtos';


export class CareerGoalMapper implements IMapper<CareerGoal, CareerGoalDto>
{

  private constructor()
  {
  }

  public static create(): CareerGoalMapper
  {
    return new CareerGoalMapper();
  }

  toDTO(input: CareerGoal): CareerGoalDto
  {
    const careerGoalDto: CareerGoalDto =
    {
      location: input.location,
      occupation: input.occupation,
      degreeLevel: input.degreeLevel,
      degreeProgram: input.degreeProgram,
      retirementAge: input.retirementAge,
      careerGoalPathType: input.careerGoalPathType
    };

    return careerGoalDto;
  }

  toDomain(input: CareerGoalDto): Result<CareerGoal>
  {
    return CareerGoal.create
      (
        {
          location: input?.location ?? null,
          occupation: input?.occupation ?? null,
          degreeLevel: input?.degreeLevel ?? null,
          degreeProgram: input?.degreeProgram ?? null,
          retirementAge: input?.retirementAge ?? null,
          careerGoalPathType: input?.careerGoalPathType ?? null
        }
      );
  }

}
