import { createAction } from '@ngrx/store';


export const setOffCanvasOpen = createAction
  (
    '[Off-Canvas] set active panel'
  );

export const setOffCanvasClosed = createAction
  (
    '[Off-Canvas] reset accordion'
  );
