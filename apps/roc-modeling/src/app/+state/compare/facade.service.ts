import { Injectable } from '@angular/core';
import { RoiModelDto } from '@app/domain';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { addToCompare, clearAll, removeCompareModelFromCompare, removeRoiAggregateFromCompare } from './actions';
import { getCompareCount, getCompareIdList, getCompareList } from './selectors';
import { CompareModel } from './state';


@Injectable({
  providedIn: 'root'
})
export class CompareFacadeService
{

  constructor
    (
      private store: Store
    )
  {
  }

  addToCompare(roiModelDto: RoiModelDto)
  {
    return this.store.dispatch(addToCompare({ roiModelDto }));
  }

  removeCompareModelFromCompare(compareModel: CompareModel)
  {
    return this.store.dispatch(removeCompareModelFromCompare({ compareModel }));
  }

  removeRoiAggregateFromCompare(roiModelDto: RoiModelDto)
  {
    return this.store.dispatch(removeRoiAggregateFromCompare({ roiModelDto }));
  }

  getCompareList$(): Observable<CompareModel[]>
  {
    return this.store.pipe(select(getCompareList));
  }

  getCompareIdList$(): Observable<string[] | number[]>
  {
    return this.store.pipe(select(getCompareIdList));
  }

  getCompareCount$(): Observable<number>
  {
    return this.store.pipe(select(getCompareCount));
  }

  clearAll()
  {
    return this.store.dispatch(clearAll());
  }
}
