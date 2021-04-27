import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { ACCORDION_STORE_FEATURE_KEY, AccordionPanelEnum, AccordionState } from './state';


// RETRIEVE SLICE OF STATE
export const accordionSlice: MemoizedSelector<object, AccordionState> = createFeatureSelector<AccordionState>(ACCORDION_STORE_FEATURE_KEY);


export const selectAccordion: MemoizedSelector<object, AccordionState> = createSelector
  (
    accordionSlice,
    (state: AccordionState): AccordionState => state
  );


export const selectActiveAccordionPanel: MemoizedSelector<object, AccordionPanelEnum> = createSelector
  (
    accordionSlice,
    (state: AccordionState): AccordionPanelEnum => state.activePanel
  );
