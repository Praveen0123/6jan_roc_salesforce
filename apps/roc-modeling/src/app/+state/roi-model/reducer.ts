import { createReducer, on } from '@ngrx/store';

import { requestLogout } from '../user/actions';
import { clearAll, deleteRoiModel, updateRoiModel } from './actions';
import { initialRoiModelStoreState } from './state';


export const reducer = createReducer
  (
    initialRoiModelStoreState,

    on(updateRoiModel, (state, { roiModelDto }) => ({ ...state, activeRoiModel: roiModelDto })),

    on(deleteRoiModel, clearAll, requestLogout, (state) => ({ ...state, activeRoiModel: null }))
  );
