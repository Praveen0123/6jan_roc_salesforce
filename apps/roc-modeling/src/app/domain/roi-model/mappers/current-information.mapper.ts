import { IMapper, Result } from '@vantage-point/ddd-core';

import { CurrentInformation } from '../domain/current-information.model';
import { CurrentInformationDto } from '../dtos';


export class CurrentInformationMapper implements IMapper<CurrentInformation, CurrentInformationDto>
{

  private constructor()
  {
  }

  public static create(): CurrentInformationMapper
  {
    return new CurrentInformationMapper();
  }

  toDTO(input: CurrentInformation): CurrentInformationDto
  {
    const careerGoalDto: CurrentInformationDto =
    {
      currentAge: input.currentAge,
      occupation: input.occupation,
      location: input.location,
      educationLevel: input.educationLevel
    };

    return careerGoalDto;
  }

  toDomain(input: CurrentInformationDto): Result<CurrentInformation>
  {
    return CurrentInformation.create
      (
        {
          currentAge: input?.currentAge ?? null,
          occupation: input?.occupation ?? null,
          location: input?.location ?? null,
          educationLevel: input?.educationLevel ?? null
        }
      );
  }

}
