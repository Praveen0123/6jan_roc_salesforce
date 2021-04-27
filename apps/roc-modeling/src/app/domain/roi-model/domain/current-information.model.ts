import { CONFIG } from '@app/config/config';
import { EducationLevelEnum } from '@app/core/models';
import { Location, Occupation } from '@gql';
import { Entity, Guard, Result } from '@vantage-point/ddd-core';


interface CurrentInformationProps
{
  currentAge: number;
  occupation?: Occupation;
  location: Location;
  educationLevel: EducationLevelEnum;
}

export class CurrentInformation extends Entity<CurrentInformationProps>
{
  get currentAge(): number
  {
    return this.props.currentAge;
  }
  get occupation(): Occupation
  {
    return this.props.occupation;
  }
  get location(): Location
  {
    return this.props.location;
  }
  get educationLevel(): EducationLevelEnum
  {
    return this.props.educationLevel;
  }


  private constructor(props: CurrentInformationProps)
  {
    super(props);
  }

  static create(props: CurrentInformationProps): Result<CurrentInformation>
  {
    const propsResult = Guard.againstNullOrUndefinedBulk(
      [
        // { argument: props.occupation, argumentName: 'career occupation' },
        // { argument: props.degreeLevel, argumentName: 'degree level' },
        // { argument: props.degreeProgram, argumentName: 'degree program' }
      ]);

    if (!propsResult.succeeded)
    {
      return Result.failure<CurrentInformation>(propsResult.message || 'current information properties error');
    }

    const currentInformation = new CurrentInformation
      (
        {
          ...props,
          currentAge: props.currentAge ?? CurrentInformation.defaultProps.currentAge
        }
      );

    return Result.success<CurrentInformation>(currentInformation);
  }

  static get defaultProps(): CurrentInformationProps
  {
    const props: CurrentInformationProps =
    {
      currentAge: CONFIG.USER_PROFILE.DEFAULT_AGE,
      occupation: null,
      location: null,
      educationLevel: null
    };

    return props;
  }


  isValid(): boolean
  {
    const hasLocation: boolean = (this.props.location !== null && this.props.location !== undefined);
    const hasEducationLevelEnum: boolean = (this.props.educationLevel !== null && this.props.educationLevel !== undefined);

    return (hasLocation && hasEducationLevelEnum);
  }
}
