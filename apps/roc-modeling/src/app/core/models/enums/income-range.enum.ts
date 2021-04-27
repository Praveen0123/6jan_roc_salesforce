import { Enumeration } from '@vantage-point/ddd-core';
import { orderBy } from 'lodash';

export class IncomeRangeEnum extends Enumeration
{
  public static Instances: IncomeRangeEnum[] = [];
  public static readonly UNKNOWN = new IncomeRangeEnum(0, 'Unknown', 'default', 0);
  public static readonly From_0_To_30000 = new IncomeRangeEnum(1, '0 - $30K', 'income0To30000', 1);
  public static readonly From_30001_To_48000 = new IncomeRangeEnum(2, '$30.1K - $48K', 'income30001To48000', 2);
  public static readonly From_48001_To_75000 = new IncomeRangeEnum(3, '$48.1K - $75K', 'income48001To75000', 3);
  public static readonly From_75001_To_110000 = new IncomeRangeEnum(4, '$75.1K - $110K', 'income75001To110000', 4);
  public static readonly From_110001_Or_More = new IncomeRangeEnum(5, "$Over $110K", 'incomeOver110000', 5);

  public key: string;
  private ordinal: number;

  private constructor
    (
      value: number,
      displayName: string,
      key: string,
      ordinal: number
    )
  {
    super(value, displayName);

    this.key = key;
    this.ordinal = ordinal;

    if (this.ordinal)
    {
      this.ordinal = 0;
    }

    IncomeRangeEnum.Instances.push(this);
  }

  static fromValue(value: number): IncomeRangeEnum
  {
    try
    {
      if (IncomeRangeEnum.Instances)
      {
        const instance = IncomeRangeEnum.Instances.filter((item: Enumeration) => item.value === value);

        if (instance != null && instance.length === 1)
        {
          return instance[0];
        }
      }

      return IncomeRangeEnum.UNKNOWN;
    }
    catch (error)
    {
      return IncomeRangeEnum.UNKNOWN;
    }
  }

  static fromDisplayName(displayName: string): IncomeRangeEnum
  {
    try
    {
      if (IncomeRangeEnum.Instances)
      {
        const instance = IncomeRangeEnum.Instances.filter((item: Enumeration) => item.displayName === displayName);

        if (instance != null && instance.length === 1)
        {
          return instance[0];
        }
      }

      return IncomeRangeEnum.UNKNOWN;
    }
    catch (error)
    {
      return IncomeRangeEnum.UNKNOWN;
    }
  }

  static fromKey(key: string): IncomeRangeEnum
  {
    try
    {
      if (IncomeRangeEnum.Instances)
      {
        const instance = IncomeRangeEnum.Instances.filter((item: IncomeRangeEnum) => item.key === key);

        if (instance != null && instance.length === 1)
        {
          return instance[0];
        }
      }

      return IncomeRangeEnum.UNKNOWN;
    }
    catch (error)
    {
      return IncomeRangeEnum.UNKNOWN;
    }
  }

  static getOrderedList(): IncomeRangeEnum[]
  {
    try
    {
      if (IncomeRangeEnum.Instances)
      {
        return orderBy(IncomeRangeEnum.Instances, ['ordinal'], ['asc']);
      }

      return [IncomeRangeEnum.UNKNOWN];
    }
    catch (error)
    {
      return [IncomeRangeEnum.UNKNOWN];
    }
  }
}
