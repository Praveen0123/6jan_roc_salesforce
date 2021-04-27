import { CONFIG } from '@app/config/config';
import { EducationLevelEnum } from '@app/core/models';
import { InstructionalProgram, Location, Occupation } from '@gql';
import { Entity, Guard, Result } from '@vantage-point/ddd-core';


export enum CareerGoalPathEnum
{
  ExploreCareers = 0,
  ExploreDegrees = 1
}

export interface CareerGoalProps
{
  location: Location;
  occupation: Occupation;
  degreeLevel: EducationLevelEnum;
  degreeProgram: InstructionalProgram;
  retirementAge: number;
  careerGoalPathType: CareerGoalPathEnum;
}

export class CareerGoal extends Entity<CareerGoalProps>
{
  get location(): Location
  {
    return this.props.location;
  }
  get occupation(): Occupation
  {
    return this.props.occupation;
  }
  get degreeLevel(): EducationLevelEnum
  {
    return this.props.degreeLevel;
  }
  get degreeProgram(): InstructionalProgram
  {
    return this.props.degreeProgram;
  }
  get retirementAge(): number
  {
    return this.props.retirementAge;
  }
  get careerGoalPathType(): CareerGoalPathEnum
  {
    return this.props.careerGoalPathType;
  }


  private constructor(props: CareerGoalProps)
  {
    super(props);
  }

  static create(props: CareerGoalProps): Result<CareerGoal>
  {
    const propsResult = Guard.againstNullOrUndefinedBulk(
      [
        // { argument: props.occupation, argumentName: 'career occupation' },
        // { argument: props.degreeLevel, argumentName: 'degree level' },
        // { argument: props.degreeProgram, argumentName: 'degree program' }
      ]);

    if (!propsResult.succeeded)
    {
      return Result.failure<CareerGoal>(propsResult.message || 'career goal properties error');
    }

    const careerGoal = new CareerGoal
      (
        {
          ...props,
          retirementAge: props.retirementAge ?? CareerGoal.defaultProps.retirementAge,
          careerGoalPathType: props.careerGoalPathType ?? CareerGoal.defaultProps.careerGoalPathType
        }
      );

    return Result.success<CareerGoal>(careerGoal);
  }

  static get defaultProps(): CareerGoalProps
  {
    const props: CareerGoalProps =
    {
      location: null,
      occupation: null,
      degreeLevel: null,
      degreeProgram: null,
      retirementAge: CONFIG.CAREER_GOAL.DEFAULT_RETIREMENT_AGE,
      careerGoalPathType: CareerGoalPathEnum.ExploreCareers
    };

    return props;
  }


  updateEducationLevelEnum(educationLevelEnum: EducationLevelEnum)
  {
    console.log('OVERRIDE EDUCATION LEVEL', educationLevelEnum);
    // this.props.degreeLevel = educationLevelEnum;
  }

  setLocation(location?: Location)
  {
    this.props.location = location ?? null;
  }

  setOccupation(occupation?: Occupation)
  {
    this.props.occupation = occupation ?? null;
  }

  setDegreeLevel(degreeLevel?: EducationLevelEnum)
  {
    this.props.degreeLevel = degreeLevel ?? null;
  }

  setDegreeProgram(degreeProgram?: InstructionalProgram)
  {
    this.props.degreeProgram = degreeProgram ?? null;
  }

  setRetirementAge(retirementAge?: number)
  {
    this.props.retirementAge = retirementAge ?? CONFIG.CAREER_GOAL.DEFAULT_RETIREMENT_AGE;
  }

  isValid(): boolean
  {
    const hasOccupation: boolean = (this.props.occupation !== null && this.props.occupation !== undefined);
    const hasDegreeLevel: boolean = (this.props.degreeLevel !== null && this.props.degreeLevel !== undefined);
    const hasDegreeProgram: boolean = (this.props.degreeProgram !== null && this.props.degreeProgram !== undefined);

    return (hasOccupation && hasDegreeLevel && hasDegreeProgram);
  }
}
