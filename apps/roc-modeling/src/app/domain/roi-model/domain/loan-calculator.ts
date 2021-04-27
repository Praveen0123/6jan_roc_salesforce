const LOAN_CONSTANTS = {
  DEPENDENT: {
    FEDERAL_SUBSIDIZED: {
      YEAR_1: 3500,
      YEAR_2: 4500,
      YEAR_3_PLUS: 5500,
      TOTAL: 23000,
    },
    FEDERAL_UNSUBSIDIZED: {
      YEAR_1: 2000,
      YEAR_2: 2000,
      YEAR_3_PLUS: 2000,
      TOTAL: 8000,
    },
  },
  INDEPENDENT: {
    FEDERAL_SUBSIDIZED: {
      YEAR_1: 3500,
      YEAR_2: 4500,
      YEAR_3_PLUS: 7500,
      TOTAL: 23000,
    },
    FEDERAL_UNSUBSIDIZED: {
      YEAR_1: 6000,
      YEAR_2: 6000,
      YEAR_3_PLUS: 7000,
      TOTAL: 34500,
    },
  },
} as const;

// TODO: check max pell amount. I found one source that says it's 6345 for fulltime and 1698 for halftime
export const getPellGrantAidByYear = (efc: number, fullTimeStudentPercent: number, costOfAttendanceByYear: number[], yearsToCompleteDegree: number): number[] =>
{
  const pellGrantAidByYear = [];

  for (let i = 0; i < yearsToCompleteDegree; i++)
  {
    const pellGrantAidForCurrentYear = getPellGrantAidForYear(efc, costOfAttendanceByYear[i], fullTimeStudentPercent);

    pellGrantAidByYear.push(pellGrantAidForCurrentYear);
  }

  return pellGrantAidByYear;
};

export const getPellGrantAidForYear = (efc: number, costOfAttendance: number, fullTimeStudentPercent: number) =>
{
  if (efc === null)
  {
    efc = 1e20;
  }

  let maxLimit;
  if (fullTimeStudentPercent === 1)
  {
    maxLimit = 5711;
  } else
  {
    maxLimit = 5100;
  }

  let pellGrantAid = (costOfAttendance - efc) * fullTimeStudentPercent;

  if (pellGrantAid < 638) pellGrantAid = 0;
  else if (pellGrantAid > maxLimit) pellGrantAid = maxLimit;

  return pellGrantAid;
};

export const calculateLoanForYear = (
  cumulativeUpToCurrentYearInfo: CumulativeUpToCurrentYearInfo,
  costOfAttendanceForCurrentYear: number,
  outOfPocketExpensesByYear: number[],
  isTaxIndependent: boolean,
  efc: number,
  participation: number,
  grantOrScholarshipAidExcludingPellGrant: number
):
  {
    pellGrantAid: number;
    federalSubsidizedLoan: number;
    federalUnsubsidizedLoan: number;
    commercialLoan: number;
  } =>
{
  const pellGrantAid = getPellGrantAidForYear(efc, costOfAttendanceForCurrentYear, participation);
  const yearOfCollegeIndex = cumulativeUpToCurrentYearInfo.yearOfCollegeIndex;
  let outOfPocketExpensesForCurrentYear: number;
  if (yearOfCollegeIndex < outOfPocketExpensesByYear.length)
  {
    outOfPocketExpensesForCurrentYear = outOfPocketExpensesByYear[yearOfCollegeIndex];
  } else
  {
    outOfPocketExpensesForCurrentYear = outOfPocketExpensesByYear[outOfPocketExpensesByYear.length - 1];
  }
  let enableSubsidized = false;
  if (costOfAttendanceForCurrentYear > efc)
  {
    enableSubsidized = true;
  }

  const m = costOfAttendanceForCurrentYear - outOfPocketExpensesForCurrentYear - pellGrantAid - grantOrScholarshipAidExcludingPellGrant;

  if (m < 0)
  {
    throw new Error('Too big expenseFromSavings');
  }

  let maxFederalSubsidizedAllowed = 0;
  let maxFederalUnsubsidizedAllowed = 0;
  let federalSubsidizedLoan = 0;
  let federalUnsubsidizedLoan = 0;
  let commercialLoan = 0;

  maxFederalSubsidizedAllowed = getLoanLimitsForYear(
    isTaxIndependent,
    yearOfCollegeIndex
  ).yearSubsidized;
  maxFederalUnsubsidizedAllowed = getLoanLimitsForYear(
    isTaxIndependent,
    yearOfCollegeIndex
  ).yearUnsubsidized;

  if (enableSubsidized)
  {
    const t =
      (isTaxIndependent
        ? LOAN_CONSTANTS.INDEPENDENT.FEDERAL_SUBSIDIZED.TOTAL
        : LOAN_CONSTANTS.DEPENDENT.FEDERAL_SUBSIDIZED.TOTAL) -
      cumulativeUpToCurrentYearInfo.totalLoanSubsidizedFederal;

    if (t <= 0.0) maxFederalSubsidizedAllowed = 0.0;

    if (t < maxFederalSubsidizedAllowed) maxFederalSubsidizedAllowed = t;

    federalSubsidizedLoan = maxFederalSubsidizedAllowed;
  }

  const t1 = m - federalSubsidizedLoan;

  if (t1 <= 0.0)
  {
    commercialLoan = 0.0;
    federalUnsubsidizedLoan = 0.0;
    federalSubsidizedLoan = m;
  } else
  {
    const t2 =
      (isTaxIndependent
        ? LOAN_CONSTANTS.INDEPENDENT.FEDERAL_UNSUBSIDIZED.TOTAL
        : LOAN_CONSTANTS.DEPENDENT.FEDERAL_UNSUBSIDIZED.TOTAL) -
      cumulativeUpToCurrentYearInfo.totalLoanUnsubsidizedFederal;

    if (t2 <= 0) maxFederalUnsubsidizedAllowed = 0.0;

    if (t2 < maxFederalUnsubsidizedAllowed) maxFederalUnsubsidizedAllowed = t2;

    federalUnsubsidizedLoan = maxFederalUnsubsidizedAllowed;

    const t3 = m - federalSubsidizedLoan - federalUnsubsidizedLoan;

    if (t3 <= 0.0)
    {
      commercialLoan = 0;
      federalUnsubsidizedLoan = m - federalSubsidizedLoan;
    } else
    {
      commercialLoan = t3;
    }
  }

  const result = {
    pellGrantAid: pellGrantAid,
    federalSubsidizedLoan: federalSubsidizedLoan,
    federalUnsubsidizedLoan: federalUnsubsidizedLoan,
    commercialLoan: commercialLoan,
  } as const;

  return result;
};

interface CumulativeUpToCurrentYearInfo
{
  totalLoanSubsidizedFederal: number;
  totalLoanUnsubsidizedFederal: number;
  yearOfCollegeIndex: number;
}

export interface LoansByYear
{
  federalSubsidizedLoanAmountByYear: number[];
  federalUnsubsidizedLoanAmountByYear: number[];
  federalLoanAmountByYear: number[];
  privateLoanAmountByYear: number[];
  pellGrantAidByYear: number[];
}

export interface CostOfAttendanceComponents
{
  tuitionAndFees: number;
  tuitionAndFeesRaise: number;
  booksAndSupplies: number;
  booksAndSuppliesRaise: number;
  roomAndBoard: number;
  roomAndBoardRaise: number;
  otherLivingExpenses: number;
  otherLivingExpensesRaise: number;
}

const getCostOfAttendanceForYear = (
  components: CostOfAttendanceComponents,
  yearOfCollegeIndex: number,
  startingYearDelay: number = 0
) =>
{
  const costOfAttendanceForYear = (components.tuitionAndFees * Math.pow(1.0 + (components.tuitionAndFeesRaise / 100), yearOfCollegeIndex + startingYearDelay))
    // + (components.booksAndSupplies * Math.pow(1.0 + (components.booksAndSuppliesRaise / 100), yearOfCollegeIndex + startingYearDelay))
    + (components.roomAndBoard * Math.pow(1.0 + (components.roomAndBoardRaise / 100), yearOfCollegeIndex + startingYearDelay));
  // + (components.otherLivingExpenses * Math.pow(1.0 + (components.otherLivingExpensesRaise / 100), yearOfCollegeIndex + startingYearDelay));

  return costOfAttendanceForYear;
};

export const getCostOfAttendanceByYear = (
  components: CostOfAttendanceComponents,
  yearsToCompleteDegree: number,
  startingYearDelay: number = 0
) =>
{
  const costOfAttendanceByYear = [];

  for (let yearIndex = 0; yearIndex < yearsToCompleteDegree; yearIndex++)
  {
    const costOfAttendanceForCurrentYear = getCostOfAttendanceForYear(components, yearIndex, startingYearDelay);
    costOfAttendanceByYear.push(costOfAttendanceForCurrentYear);
  }
  return costOfAttendanceByYear;
};

export const getNetPriceByYear = (
  costOfAttendanceByYear: number[],
  grantOrScholarshipAidExcludingPellGrant: number,
  pellGrantAidByYear: number[],
  yearsToCompleteDegree: number
) =>
{
  const result = [];

  for (let i = 0; i < yearsToCompleteDegree; i++)
  {
    result.push(costOfAttendanceByYear[i] - grantOrScholarshipAidExcludingPellGrant - pellGrantAidByYear[i]);
  }

  return result;
};

export const calculateLoansByYear = (
  costOfAttendanceByYear: number[],
  outOfPocketExpensesByYear: number[],
  yearsToCompleteDegree: number,
  isTaxIndependent: boolean,
  efc: number,
  participation: number,
  grantOrScholarshipAidExcludingPellGrant: number
) =>
{

  if (efc === null)
  {
    efc = 1e20;
  }

  const output: LoansByYear = {
    federalSubsidizedLoanAmountByYear: [],
    federalUnsubsidizedLoanAmountByYear: [],
    federalLoanAmountByYear: [],
    privateLoanAmountByYear: [],
    pellGrantAidByYear: [],
  };

  const currentYearInfo: CumulativeUpToCurrentYearInfo = {
    totalLoanSubsidizedFederal: 0,
    totalLoanUnsubsidizedFederal: 0,
    yearOfCollegeIndex: 0,
  };

  for (let i = 0; i < yearsToCompleteDegree; i++)
  {
    currentYearInfo.yearOfCollegeIndex = i;

    const res = calculateLoanForYear(
      currentYearInfo,
      costOfAttendanceByYear[i],
      outOfPocketExpensesByYear,
      isTaxIndependent,
      efc,
      participation,
      grantOrScholarshipAidExcludingPellGrant
    );

    output.pellGrantAidByYear.push(res.pellGrantAid);
    output.federalSubsidizedLoanAmountByYear.push(res.federalSubsidizedLoan);
    output.federalUnsubsidizedLoanAmountByYear.push(res.federalUnsubsidizedLoan);
    output.privateLoanAmountByYear.push(res.commercialLoan);
    output.federalLoanAmountByYear.push(
      res.federalSubsidizedLoan + res.federalUnsubsidizedLoan
    );

    currentYearInfo.totalLoanSubsidizedFederal += res.federalSubsidizedLoan;
    currentYearInfo.totalLoanUnsubsidizedFederal += res.federalUnsubsidizedLoan;
  }
  return output;
};

const getLoanLimitsForYear = (isTaxIndependent: boolean, yearOfCollegeIndex: number) =>
{
  let yearSubsidized;
  let yearUnsubsidized;

  if (isTaxIndependent)
  {
    if (yearOfCollegeIndex === 0)
    {
      yearSubsidized = LOAN_CONSTANTS.INDEPENDENT.FEDERAL_SUBSIDIZED.YEAR_1;
      yearUnsubsidized = LOAN_CONSTANTS.INDEPENDENT.FEDERAL_UNSUBSIDIZED.YEAR_1;
    } else if (yearOfCollegeIndex === 1)
    {
      yearSubsidized = LOAN_CONSTANTS.INDEPENDENT.FEDERAL_SUBSIDIZED.YEAR_2;
      yearUnsubsidized = LOAN_CONSTANTS.INDEPENDENT.FEDERAL_UNSUBSIDIZED.YEAR_2;
    } else
    {
      yearSubsidized =
        LOAN_CONSTANTS.INDEPENDENT.FEDERAL_SUBSIDIZED.YEAR_3_PLUS;
      yearUnsubsidized =
        LOAN_CONSTANTS.INDEPENDENT.FEDERAL_UNSUBSIDIZED.YEAR_3_PLUS;
    }
  } else
  {
    if (yearOfCollegeIndex === 0)
    {
      yearSubsidized = LOAN_CONSTANTS.DEPENDENT.FEDERAL_SUBSIDIZED.YEAR_1;
      yearUnsubsidized = LOAN_CONSTANTS.DEPENDENT.FEDERAL_UNSUBSIDIZED.YEAR_1;
    } else if (yearOfCollegeIndex === 1)
    {
      yearSubsidized = LOAN_CONSTANTS.DEPENDENT.FEDERAL_SUBSIDIZED.YEAR_2;
      yearUnsubsidized = LOAN_CONSTANTS.DEPENDENT.FEDERAL_UNSUBSIDIZED.YEAR_2;
    } else
    {
      yearSubsidized = LOAN_CONSTANTS.DEPENDENT.FEDERAL_SUBSIDIZED.YEAR_3_PLUS;
      yearUnsubsidized =
        LOAN_CONSTANTS.DEPENDENT.FEDERAL_UNSUBSIDIZED.YEAR_3_PLUS;
    }
  }

  const result = {
    yearSubsidized,
    yearUnsubsidized,
  } as const;

  return result;
};

export interface LoanLimitsInfo
{
  federalSubsidizedLoanByYear: number[];
  federalUnsubsidizedLoanByYear: number[];
  cumulativeFederalSubsidizedLoan: number;
  cumulativeFederalUnsubsidizedLoan: number;
}

export const getLoanLimitsInfo = (isTaxIndependent: boolean, yearsToCompleteDegree: number) =>
{
  const federalSubsidizedLoanByYear = [];
  const federalUnsubsidizedLoanByYear = [];

  for (let i = 0; i < yearsToCompleteDegree; i++)
  {
    const r = getLoanLimitsForYear(isTaxIndependent, i);
    federalSubsidizedLoanByYear.push(r.yearSubsidized);
    federalUnsubsidizedLoanByYear.push(r.yearUnsubsidized);
  }

  const output: LoanLimitsInfo = {
    federalSubsidizedLoanByYear,
    federalUnsubsidizedLoanByYear,
    cumulativeFederalSubsidizedLoan: isTaxIndependent
      ? LOAN_CONSTANTS.INDEPENDENT.FEDERAL_SUBSIDIZED.TOTAL
      : LOAN_CONSTANTS.DEPENDENT.FEDERAL_SUBSIDIZED.TOTAL,
    cumulativeFederalUnsubsidizedLoan: isTaxIndependent
      ? LOAN_CONSTANTS.INDEPENDENT.FEDERAL_UNSUBSIDIZED.TOTAL
      : LOAN_CONSTANTS.DEPENDENT.FEDERAL_UNSUBSIDIZED.TOTAL,
  } as const;

  return output;
};
