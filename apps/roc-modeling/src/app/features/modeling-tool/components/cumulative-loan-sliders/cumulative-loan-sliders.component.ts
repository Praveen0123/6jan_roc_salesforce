import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RoiModelDto } from '@app/domain';
import * as loanCalculator from '@app/domain/roi-model/domain/loan-calculator';

export interface CumulativeLoanSlidersOutput
{
  outOfPocketExpensesByYear: number[];
  federalSubsidizedLoanAmountByYear: number[];
  federalUnsubsidizedLoanAmountByYear: number[];
  federalLoanAmountByYear: number[];
  privateLoanAmountByYear: number[];
  pellGrantAidByYear: number[];
}

@Component({
  selector: 'roc-cumulative-loan-sliders',
  templateUrl: './cumulative-loan-sliders.component.html',
  styleUrls: ['./cumulative-loan-sliders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CumulativeLoanSlidersComponent implements OnInit, OnChanges
{
  @Input() roiModelDto: RoiModelDto;
  @Output() cumulativeLoanSlidersOutputChange = new EventEmitter<CumulativeLoanSlidersOutput>();

  // inputs
  cumulativeNetPrice: number;
  netPriceByYear: number[];
  cumulativeOutOfPocketExpenses: number;
  cumulativeFederalSubsidizedLoanLimit: number;
  cumulativeFederalUnsubsidizedLoanLimit: number;
  yearsToCompleteDegree: number;
  costOfAttendanceByYear: number[];
  isTaxDependent: boolean;
  efc: number;
  fullTimeStudentPercent: number;
  grantOrScholarshipAidExcludingPellGrant: number;
  sliderStep: number;

  // outputs
  outOfPocketExpensesByYear: number[];
  federalSubsidizedLoanAmountByYear: number[];
  federalUnsubsidizedLoanAmountByYear: number[];
  federalLoanAmountByYear: number[];
  privateLoanAmountByYear: number[];
  pellGrantAidByYear: number[];

  // calculated amounts
  cumulativeFederalSubsidizedLoanAmount: number;
  cumulativeFederalUnsubsidizedLoanAmount: number;
  cumulativeFederalLoanAmount: number;
  cumulativePrivateLoanAmount: number;
  cumulativePellGrantAid: number;


  constructor() { }

  ngOnInit(): void
  {
    this.setLocalVariables();
    this.onCumulativeOutOfPocketExpensesInput(this.cumulativeOutOfPocketExpenses);
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.roiModelDto && !changes.roiModelDto.firstChange)
    {
      this.setLocalVariables();
      this.onCumulativeOutOfPocketExpensesInput(this.cumulativeOutOfPocketExpenses);
    }
  }

  setLocalVariables()
  {
    this.isTaxDependent = this.roiModelDto.educationFinancing.isTaxDependent;
    this.outOfPocketExpensesByYear = this.roiModelDto.educationFinancing.outOfPocketExpensesByYear;

    this.netPriceByYear = this.roiModelDto.netPriceByYear;
    this.cumulativeNetPrice = this.arraySum(this.roiModelDto.netPriceByYear);
    this.cumulativeOutOfPocketExpenses = this.arraySum(this.roiModelDto.outOfPocketExpensesByYear);
    this.cumulativeFederalSubsidizedLoanLimit = this.arraySum(this.roiModelDto.federalSubsidizedLoanLimitByYear);
    this.cumulativeFederalUnsubsidizedLoanLimit = this.arraySum(this.roiModelDto.federalUnsubsidizedLoanLimitByYear);
    this.yearsToCompleteDegree = this.roiModelDto.educationCost.yearsToCompleteDegree;
    this.costOfAttendanceByYear = this.roiModelDto.costOfAttendanceByYear;
    this.efc = this.roiModelDto.efc;
    this.fullTimeStudentPercent = this.roiModelDto.educationCost.isFulltime ? 1 : 0.5;
    this.grantOrScholarshipAidExcludingPellGrant = this.roiModelDto.grantOrScholarshipAidExcludingPellGrant;
    this.sliderStep = (this.cumulativeNetPrice * .05);
    this.cumulativeOutOfPocketExpenses = this.arraySum(this.roiModelDto.outOfPocketExpensesByYear);
  }

  onCumulativeOutOfPocketExpensesInput(cumulativeOutOfPocketExpenses: number)
  {
    let remainingCumulativeOutOfPocketExpenses = cumulativeOutOfPocketExpenses;
    const outOfPocketExpensesByYear = [];
    for (let i = 0; i < this.yearsToCompleteDegree; i++)
    {
      if (remainingCumulativeOutOfPocketExpenses >= this.netPriceByYear[i])
      {
        outOfPocketExpensesByYear.push(this.netPriceByYear[i]);
        remainingCumulativeOutOfPocketExpenses -= this.netPriceByYear[i];
      } else
      {
        outOfPocketExpensesByYear.push(remainingCumulativeOutOfPocketExpenses);
        remainingCumulativeOutOfPocketExpenses -= remainingCumulativeOutOfPocketExpenses;
      }
    }

    const modeledLoansByYear = loanCalculator.calculateLoansByYear(
      this.costOfAttendanceByYear,
      outOfPocketExpensesByYear,
      this.yearsToCompleteDegree,
      !this.isTaxDependent,
      this.efc,
      this.fullTimeStudentPercent,
      this.grantOrScholarshipAidExcludingPellGrant
    );

    this.outOfPocketExpensesByYear = outOfPocketExpensesByYear;
    this.federalSubsidizedLoanAmountByYear = modeledLoansByYear.federalSubsidizedLoanAmountByYear;
    this.federalUnsubsidizedLoanAmountByYear = modeledLoansByYear.federalUnsubsidizedLoanAmountByYear;
    this.federalLoanAmountByYear = modeledLoansByYear.federalLoanAmountByYear;
    this.privateLoanAmountByYear = modeledLoansByYear.privateLoanAmountByYear;
    this.privateLoanAmountByYear = modeledLoansByYear.privateLoanAmountByYear;

    this.cumulativeFederalSubsidizedLoanAmount = this.arraySum(this.federalSubsidizedLoanAmountByYear);
    this.cumulativeFederalUnsubsidizedLoanAmount = this.arraySum(this.federalUnsubsidizedLoanAmountByYear);
    this.cumulativeFederalLoanAmount = this.arraySum(this.federalLoanAmountByYear);
    this.cumulativePrivateLoanAmount = this.arraySum(this.privateLoanAmountByYear);
    this.cumulativePellGrantAid = this.arraySum(this.privateLoanAmountByYear);

  }

  onCumulativeOutOfPocketExpensesChange(cumulativeOutOfPocketExpenses: number)
  {
    this.onCumulativeOutOfPocketExpensesInput(cumulativeOutOfPocketExpenses);

    const cumulativeLoanSlidersOutput: CumulativeLoanSlidersOutput = {
      outOfPocketExpensesByYear: this.outOfPocketExpensesByYear,
      federalSubsidizedLoanAmountByYear: this.federalSubsidizedLoanAmountByYear,
      federalUnsubsidizedLoanAmountByYear: this.federalUnsubsidizedLoanAmountByYear,
      federalLoanAmountByYear: this.federalLoanAmountByYear,
      privateLoanAmountByYear: this.privateLoanAmountByYear,
      pellGrantAidByYear: this.privateLoanAmountByYear
    };

    this.cumulativeLoanSlidersOutputChange.emit(cumulativeLoanSlidersOutput);
  }

  arraySum(numberArray: number[]): number
  {
    return numberArray.reduce((p, c) => p + c, 0);
  };

}
