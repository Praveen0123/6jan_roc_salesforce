import { Enumeration } from '@vantage-point/ddd-core';
import { orderBy } from 'lodash';

export class EducationLevelEnum extends Enumeration
{
  public static Instances: EducationLevelEnum[] = [];
  public static readonly NinthGradeStudent = new EducationLevelEnum(-4, '9th Grade', 1, 0);
  public static readonly TenthGradeStudent = new EducationLevelEnum(-3, '10th Grade', 1, 1);
  public static readonly EleventhGradeStudent = new EducationLevelEnum(-2, '11th Grade', 1, 2);
  public static readonly TwelfthDegreeStudent = new EducationLevelEnum(-1, '12th Grade', 1, 3);
  public static readonly HighSchoolGraduate = new EducationLevelEnum(0, 'High School Graduate', 2, 4);
  public static readonly AssociatesDegree = new EducationLevelEnum(1, "Associate's Degree", 3, 5);
  public static readonly BachelorsDegree = new EducationLevelEnum(2, "Bachelor's Degree", 5, 6);
  public static readonly MastersDegree = new EducationLevelEnum(3, "Master's Degree", 6, 7);
  public static readonly DoctorateDegree = new EducationLevelEnum(4, "Doctorate Degree", 7, 8);

  private _ordinal: number;
  private _educationLevelGroupId: number;

  private constructor
    (
      value: number,
      displayName: string,
      educationLevelGroupId: number,
      ordinal: number
    )
  {
    super(value, displayName);

    this._educationLevelGroupId = educationLevelGroupId;
    this._ordinal = ordinal;

    EducationLevelEnum.Instances.push(this);
  }

  static fromValue(value: number): EducationLevelEnum
  {
    try
    {
      if (EducationLevelEnum.Instances)
      {
        const instance = EducationLevelEnum.Instances.filter((item: Enumeration) => item.value === value);

        if (instance != null && instance.length === 1)
        {
          console.log('enum ordinal', instance[0]._ordinal);
          return instance[0];
        }
      }

      return EducationLevelEnum.HighSchoolGraduate;
    }
    catch (error)
    {
      return EducationLevelEnum.HighSchoolGraduate;
    }
  }

  static fromDisplayName(displayName: string): EducationLevelEnum
  {
    try
    {
      if (EducationLevelEnum.Instances)
      {
        const instance = EducationLevelEnum.Instances.filter((item: Enumeration) => item.displayName === displayName);

        if (instance != null && instance.length === 1)
        {
          return instance[0];
        }
      }

      return EducationLevelEnum.HighSchoolGraduate;
    }
    catch (error)
    {
      return EducationLevelEnum.HighSchoolGraduate;
    }
  }

  static getCurrentEducationLevelOptions(): EducationLevelEnum[]
  {
    try
    {
      if (EducationLevelEnum.Instances)
      {
        const instances = EducationLevelEnum.Instances.filter((item: Enumeration) => item.value <= 0);

        return orderBy(instances, ['ordinal'], ['asc']);
      }

      return [EducationLevelEnum.HighSchoolGraduate];
    }
    catch (error)
    {
      return [EducationLevelEnum.HighSchoolGraduate];
    }
  }

  static getEducationLevelGoalOptions(): EducationLevelEnum[]
  {
    try
    {
      if (EducationLevelEnum.Instances)
      {
        const instances = EducationLevelEnum.Instances.filter((item: Enumeration) => item.value >= 0);

        return orderBy(instances, ['ordinal'], ['asc']);
      }

      return [EducationLevelEnum.HighSchoolGraduate];
    }
    catch (error)
    {
      return [EducationLevelEnum.HighSchoolGraduate];
    }
  }

  static getEducationLevelByGroupId(educationLevelGroupId: number): EducationLevelEnum
  {
    try
    {
      if (EducationLevelEnum.Instances)
      {
        const instance = EducationLevelEnum.Instances.filter((item: EducationLevelEnum) => item._educationLevelGroupId === educationLevelGroupId);

        if (instance != null && instance.length === 1)
        {
          return instance[0];
        }
      }

      return EducationLevelEnum.HighSchoolGraduate;
    }
    catch (error)
    {
      return EducationLevelEnum.HighSchoolGraduate;
    }
  }
}
