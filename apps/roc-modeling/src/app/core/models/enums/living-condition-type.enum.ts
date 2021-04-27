import { Enumeration } from '@vantage-point/ddd-core';
import { orderBy } from 'lodash';


export class LivingConditionTypeEnum extends Enumeration
{
  public static Instances: LivingConditionTypeEnum[] = [];
  public static readonly UNKNOWN = new LivingConditionTypeEnum(0, 'Unknown');
  public static readonly ON_CAMPUS = new LivingConditionTypeEnum(1, 'On Campus');
  public static readonly OFF_CAMPUS_WITH_FAMILY = new LivingConditionTypeEnum(2, 'Off Campus, with Family');
  public static readonly OFF_CAMPUS_NOT_WITH_FAMILY = new LivingConditionTypeEnum(2, 'Off Campus, not with Family');

  private constructor
    (
      value: number,
      displayName: string
    )
  {
    super(value, displayName);

    LivingConditionTypeEnum.Instances.push(this);
  }

  static fromValue(value: number): LivingConditionTypeEnum
  {
    try
    {
      if (LivingConditionTypeEnum.Instances)
      {
        const instance = LivingConditionTypeEnum.Instances.filter((item: Enumeration) => item.value === value);

        if (instance != null && instance.length === 1)
        {
          return instance[0];
        }
      }

      return LivingConditionTypeEnum.UNKNOWN;
    }
    catch (error)
    {
      return LivingConditionTypeEnum.UNKNOWN;
    }
  }

  static fromDisplayName(displayName: string): LivingConditionTypeEnum
  {
    try
    {
      if (LivingConditionTypeEnum.Instances)
      {
        const instance = LivingConditionTypeEnum.Instances.filter((item: Enumeration) => item.displayName === displayName);

        if (instance != null && instance.length === 1)
        {
          return instance[0];
        }
      }

      return LivingConditionTypeEnum.UNKNOWN;
    }
    catch (error)
    {
      return LivingConditionTypeEnum.UNKNOWN;
    }
  }

  static getOrderedList(): LivingConditionTypeEnum[]
  {
    try
    {
      if (LivingConditionTypeEnum.Instances)
      {
        return orderBy(LivingConditionTypeEnum.Instances, ['displayName'], ['asc']);
      }

      return [LivingConditionTypeEnum.UNKNOWN];
    }
    catch (error)
    {
      return [LivingConditionTypeEnum.UNKNOWN];
    }
  }
}
