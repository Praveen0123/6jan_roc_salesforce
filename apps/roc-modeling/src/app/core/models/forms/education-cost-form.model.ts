import { AutoCompleteModel } from '@vantage-point/auto-complete-textbox';

import { IncomeRangeEnum } from '../enums';


export interface EducationCostForm
{
  institution: AutoCompleteModel;
  startYear: number;
  incomeRange: IncomeRangeEnum;
  isFulltime: boolean;
  yearsToCompleteDegree: number;
  isValid: boolean;
}
