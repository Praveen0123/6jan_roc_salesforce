import { createReducer, on } from '@ngrx/store';

import { requestLogout } from '../user/actions';
import { resetAccordion, setActivePanel, setCareerGoalValidity, setCurrentInformationValidity, setEducationCostValidity } from './actions';
import { initialAccordionState } from './state';



export const accordionReducer = createReducer
  (

    initialAccordionState,

    on(setCurrentInformationValidity, (state, { isCurrentInformationValid }) => ({ ...state, isCurrentInformationValid })),

    on(setCareerGoalValidity, (state, { isCareerGoalValid }) => ({ ...state, isCareerGoalValid })),

    on(setEducationCostValidity, (state, { isEducationCostValid }) => ({ ...state, isEducationCostValid })),

    on(setActivePanel, (state, { accordionPanel }) => ({ ...state, activePanel: accordionPanel })),

    on(resetAccordion, () => ({ ...initialAccordionState })),

    on(requestLogout, () => ({ ...initialAccordionState }))

  );
