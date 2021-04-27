export interface RoiCalculatorInput
{
  currentZipCode: string;
  goalZipCode: string;
  distance: number;
  currentStateOnetCode: string[];
  currentStateOccupationTitle: string;
  goalStateOnetCode: string[];
  goalStateOccupationTitle: string;
  startDegreeLevel: number;
  endDegreeLevel: number;
  yearsOfCollege: number;
  yearsToRetirement: number;
  tuitionAndFees: number;
  tuitionAndFeesRaise: number;
  livingArrangementCost: number;
  livingArrangementCostRaise: number;
  independent: boolean;
  ibrFederal: boolean;
  monthsToPayoffFederalLoan: number;
  monthsToPayoffPrivateLoan: number;
  annualExpenseFromSavings: number[];
  efc: number;
  participation: number;
  workDuringStudy: boolean;
  ipedsGraduationTimeFactor: number[];
  ipedsGraduationProbability: number[];
  ipedsRetentionRate: number[];
  grantOrScholarshipAidExcludingPellGrant: number;
  startingYearDelay: number;
  noLoans: boolean;
}
