import { createReducer, on } from '@ngrx/store';

import { deleteRoiModel } from '../roi-model/actions';
import { requestLogout } from '../user/actions';
import { clearAll, loadCompareModel, removeCompareModelFromCompare, removeRoiAggregateFromCompare } from './actions';
import { compareStateAdapter, initialCompareStoreState } from './state';



export const reducer = createReducer
  (
    initialCompareStoreState,

    on(loadCompareModel, (state, { compareModel }) => compareStateAdapter.addOne(compareModel, { ...state })),

    on(removeCompareModelFromCompare, (state, { compareModel }) => compareStateAdapter.removeOne(compareModel.roiModelId, { ...state })),
    on(removeRoiAggregateFromCompare, (state, { roiModelDto }) => compareStateAdapter.removeOne(roiModelDto.roiModelId, { ...state })),

    on(clearAll, (state) => compareStateAdapter.removeAll({ ...state })),

    on(deleteRoiModel, (state, { roiModelDto }) => compareStateAdapter.removeOne(roiModelDto.roiModelId, { ...state })),

    on(requestLogout, (state) => compareStateAdapter.removeAll({ ...state }))
  );
