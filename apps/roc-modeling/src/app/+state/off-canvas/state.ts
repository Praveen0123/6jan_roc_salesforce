export const OFF_CANVAS_STORE_FEATURE_KEY = 'off-canvas';


export interface OffCanvasState
{
  isOffCanvasPanelOpened: boolean;
}

export const initialOffCanvasState: OffCanvasState =
{
  isOffCanvasPanelOpened: false
};
