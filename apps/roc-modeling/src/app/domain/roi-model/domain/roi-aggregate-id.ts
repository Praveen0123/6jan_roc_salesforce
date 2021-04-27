import { Entity, UniqueEntityID } from '@vantage-point/ddd-core';

export class RoiAggregateId extends Entity<any>
{
  get id(): UniqueEntityID
  {
    return this._id;
  }

  private constructor(id?: UniqueEntityID)
  {
    super(null, id);
  }

  public static create(id?: UniqueEntityID | string): RoiAggregateId
  {
    if (id instanceof UniqueEntityID)
    {
      return new RoiAggregateId(id);
    }

    return new RoiAggregateId(UniqueEntityID.create(id));
  }
}
