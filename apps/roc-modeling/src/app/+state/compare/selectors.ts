import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { COMPARE_STORE_FEATURE_KEY, CompareModel, CompareStoreState, selectAll, selectIds, selectTotal } from './state';


// RETRIEVE SLICE OF STATE
export const compareStoreSlice: MemoizedSelector<object, CompareStoreState> = createFeatureSelector<CompareStoreState>(COMPARE_STORE_FEATURE_KEY);


export const getCompareList: MemoizedSelector<object, CompareModel[]> = createSelector
  (
    compareStoreSlice,
    selectAll
  );

export const getCompareIdList: MemoizedSelector<object, string[] | number[]> = createSelector
  (
    compareStoreSlice,
    selectIds
  );

export const getCompareCount: MemoizedSelector<object, number> = createSelector
  (
    compareStoreSlice,
    selectTotal
  );
