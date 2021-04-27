import { Enumeration } from '@vantage-point/ddd-core';
import { orderBy } from 'lodash';

export class ResidencyTypeEnum extends Enumeration
{
  public static Instances: ResidencyTypeEnum[] = [];
  public static readonly UNKNOWN = new ResidencyTypeEnum(0, 'Unknown', 0);
  public static readonly IN_DISTRICT = new ResidencyTypeEnum(
    1,
    'In District',
    1
  );
  public static readonly IN_STATE = new ResidencyTypeEnum(2, 'In State', 2);
  public static readonly OUT_STATE = new ResidencyTypeEnum(
    3,
    'Out of State',
    3
  );

  private ordinal: number;

  private constructor(value: number, displayName: string, ordinal: number)
  {
    super(value, displayName);

    this.ordinal = ordinal;

    ResidencyTypeEnum.Instances.push(this);
  }

  static fromValue(value: number): ResidencyTypeEnum
  {
    try
    {
      if (ResidencyTypeEnum.Instances)
      {
        const instance = ResidencyTypeEnum.Instances.filter(
          (item: Enumeration) => item.value === value
        );

        if (instance != null && instance.length === 1)
        {
          console.log('enum ordinal', instance[0].ordinal);
          return instance[0];
        }
      }

      return ResidencyTypeEnum.UNKNOWN;
    } catch (error)
    {
      return ResidencyTypeEnum.UNKNOWN;
    }
  }

  static fromDisplayName(displayName: string): ResidencyTypeEnum
  {
    try
    {
      if (ResidencyTypeEnum.Instances)
      {
        const instance = ResidencyTypeEnum.Instances.filter(
          (item: Enumeration) => item.displayName === displayName
        );

        if (instance != null && instance.length === 1)
        {
          return instance[0];
        }
      }

      return ResidencyTypeEnum.UNKNOWN;
    } catch (error)
    {
      return ResidencyTypeEnum.UNKNOWN;
    }
  }

  static getOrderedList(): ResidencyTypeEnum[]
  {
    try
    {
      if (ResidencyTypeEnum.Instances)
      {
        return orderBy(ResidencyTypeEnum.Instances, ['ordinal'], ['asc']);
      }

      return [ResidencyTypeEnum.UNKNOWN];
    } catch (error)
    {
      return [ResidencyTypeEnum.UNKNOWN];
    }
  }
}
