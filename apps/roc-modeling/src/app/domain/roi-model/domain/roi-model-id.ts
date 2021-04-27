import { Entity, UniqueEntityID } from '@vantage-point/ddd-core';

export class RoiModelId extends Entity<any>
{
  get id(): UniqueEntityID
  {
    return this._id;
  }

  private constructor(id?: UniqueEntityID)
  {
    super(null, id);
  }

  public static create(id?: UniqueEntityID | string): RoiModelId
  {
    if (id instanceof UniqueEntityID)
    {
      return new RoiModelId(id);
    }

    return new RoiModelId(UniqueEntityID.create(id));
  }
}
