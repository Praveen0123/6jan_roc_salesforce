import { createAction, props } from '@ngrx/store';

import { AccordionPanelEnum } from './state';


export const setCurrentInformationValidity = createAction
  (
    '[Accordion] set current information validity',
    props<{ isCurrentInformationValid: boolean; }>()
  );

export const setCareerGoalValidity = createAction
  (
    '[Accordion] set career goal validity',
    props<{ isCareerGoalValid: boolean; }>()
  );

export const setEducationCostValidity = createAction
  (
    '[Accordion] set education cost validity',
    props<{ isEducationCostValid: boolean; }>()
  );

export const setActivePanel = createAction
  (
    '[Accordion] set active panel',
    props<{ accordionPanel: AccordionPanelEnum; }>()
  );

export const resetAccordion = createAction
  (
    '[Accordion] reset accordion'
  );

export const checkRoiModelValidity = createAction
  (
    '[Accordion] check validity of ROI Model'
  );

export const determineActiveAccordionPanel = createAction
  (
    '[Accordion] determine active accordion panel'
  );
