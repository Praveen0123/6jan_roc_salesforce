import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export const COMPARE_STORE_FEATURE_KEY = 'compare-store';

export interface CompareModel
{
  roiModelId: string;
  goalCareerName: string;
  goalLocationCity: string;
  goalLocationState: string;
  goalRetirementAge: number;
  goalBeginningAcademicYear: number;
  goalDegreeName: string;
  institutionName: string;
  institutionAddress: string;
  institutionWebsite: string;
  institutionType: string;
  institutionGraduationRate: number;
  institutionUndergraduateStudentCount: number;

  scoresSATReadingMinimum: number;
  scoresSATReadingMaximum: number;
  scoresSATMathMinimum: number;
  scoresSATMathMaximum: number;
  scoresACTReadingMinimum: number;
  scoresACTReadingMaximum: number;
  scoresACTMathMinimum: number;
  scoresACTMathMaximum: number;
  scoresAcceptanceRate: number;

  educationNetPrice: number;
  educationFederalLoanAmount: number;
  educationPrivateLoanAmount: number;
  educationOutOfPocketCost: number;
  educationLoanDefaultRate: number;
  earningsAverageSalary: number;
  earningsAverageSalaryAlumni: number;
  earningsAverageLivingExpense: number;
  earningsDispoableIncomeMinimum: number;
  earningsDispoableIncomeMaximum: number;
  earningsYearsToBreakEven: number;
  totalReturnMinimumAmount: number;
  totalReturnMaximumAmount: number;
  totalReturnMinimumPercent: number;
  totalReturnMaximumPercent: number;
}

export interface CompareStoreState extends EntityState<CompareModel>
{

}

export const compareStateAdapter: EntityAdapter<CompareModel> = createEntityAdapter<CompareModel>
  (
    {
      selectId: (compareModel: CompareModel) => compareModel.roiModelId,
      sortComparer: false
    }
  );

export const initialCompareStoreState: CompareStoreState = compareStateAdapter.getInitialState
  (
    {
    }
  );

export const
  {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = compareStateAdapter.getSelectors();
