import { AutoCompleteModel } from '@vantage-point/auto-complete-textbox';

import { CareerGoalPathEnum, EducationLevelEnum } from '../enums';


export interface CareerGoalForm
{
  location: AutoCompleteModel;
  degreeLevel: EducationLevelEnum;
  degreeProgram: AutoCompleteModel;
  occupation: AutoCompleteModel;
  retirementAge: number;
  isValid: boolean;
  careerGoalPathType: CareerGoalPathEnum;
}
