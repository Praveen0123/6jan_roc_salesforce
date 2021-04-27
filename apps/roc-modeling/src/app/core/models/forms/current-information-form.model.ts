import { AutoCompleteModel } from '@vantage-point/auto-complete-textbox';

import { EducationLevelEnum } from '../enums';

export interface CurrentInformationForm
{
  currentAge: number;
  currentOccupation?: AutoCompleteModel;
  educationLevel: EducationLevelEnum;
  currentLocation: AutoCompleteModel;
  isValid: boolean;
}
