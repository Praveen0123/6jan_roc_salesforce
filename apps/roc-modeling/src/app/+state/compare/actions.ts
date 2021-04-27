import { RoiModelDto } from '@app/domain';
import { createAction, props } from '@ngrx/store';

import { CompareModel } from './state';


export const addToCompare = createAction
  (
    '[Compare] add to compare',
    props<{ roiModelDto: RoiModelDto; }>()
  );

export const loadCompareModel = createAction
  (
    '[Compare] load compare model',
    props<{ compareModel: CompareModel; }>()
  );

export const removeCompareModelFromCompare = createAction
  (
    '[Compare] remove compare model',
    props<{ compareModel: CompareModel; }>()
  );

export const removeRoiAggregateFromCompare = createAction
  (
    '[Compare] remove roi aggregate',
    props<{ roiModelDto: RoiModelDto; }>()
  );

export const clearAll = createAction
  (
    '[Compare] clear all'
  );
