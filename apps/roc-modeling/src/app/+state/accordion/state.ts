export const ACCORDION_STORE_FEATURE_KEY = 'accordion';

export enum AccordionPanelEnum
{
  CURRENT_INFORMATION = 0,
  CAREER_GOAL = 1,
  EDUCATION_COST = 2,
  EDUCATION_FINANCING = 3
}

export interface AccordionState
{
  activePanel: AccordionPanelEnum;
  isCurrentInformationValid: boolean;
  isCareerGoalValid: boolean;
  isEducationCostValid: boolean;
  error: any;
}

export const initialAccordionState: AccordionState =
{
  activePanel: AccordionPanelEnum.CURRENT_INFORMATION,
  isCurrentInformationValid: false,
  isCareerGoalValid: false,
  isEducationCostValid: false,
  error: null
};
