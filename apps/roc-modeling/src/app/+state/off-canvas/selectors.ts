import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { OFF_CANVAS_STORE_FEATURE_KEY, OffCanvasState } from './state';


// RETRIEVE SLICE OF STATE
export const offCanvasSlice: MemoizedSelector<object, OffCanvasState> = createFeatureSelector<OffCanvasState>(OFF_CANVAS_STORE_FEATURE_KEY);


export const isOffCanvasOpened: MemoizedSelector<object, boolean> = createSelector
  (
    offCanvasSlice,
    (state: OffCanvasState): boolean => state.isOffCanvasPanelOpened
  );
