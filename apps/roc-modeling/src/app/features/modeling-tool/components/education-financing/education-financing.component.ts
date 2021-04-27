import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { CONFIG } from '@app/config/config';
import { EducationFinancingDto, RoiModelDto } from '@app/domain';
import { debounceTime, map, takeWhile } from 'rxjs/operators';

import { CumulativeLoanSlidersOutput } from '../cumulative-loan-sliders/cumulative-loan-sliders.component';

@Component({
  selector: 'roc-education-financing',
  templateUrl: './education-financing.component.html',
  styleUrls: ['./education-financing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EducationFinancingComponent implements OnInit, OnDestroy, OnChanges
{
  private alive: boolean = true;

  @Input() roiModelDto: RoiModelDto;
  @Output('onEducationFinancingSubmitted') formSubmissionEventEmitter = new EventEmitter<EducationFinancingDto>();

  formGroup: FormGroup;

  payOffMinimumInYears: number = CONFIG.EDUCATION_FINANCING.PAY_OFF_LOAN_MINIMUM_IN_YEARS;
  payOffMaximumInYears: number = CONFIG.EDUCATION_FINANCING.PAY_OFF_LOAN_MAXIMUM_IN_YEARS;

  cumulativeAvgNetPrice: number;
  cumulativeOutOfPocketExpenses: number;
  cumulativeOutOfPocketExpensesMax: number;
  federalLoanAmountByYear: number[];
  pellGrantAidByYear: number[];
  cumulativeFederalLoanAmountMax: number = CONFIG.EDUCATION_FINANCING.MAXIMUM_FEDERAL_LOAN_AMOUNT;
  privateLoanAmountByYear: number[];
  cumulativePrivateLoanAmountMax: number;
  sliderStep: number;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void
  {
    this.buildForm();
  }

  ngOnDestroy(): void
  {
    this.alive = false;
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.roiModelDto && !changes.roiModelDto.firstChange)
    {
      this.buildForm();
    }
  }

  onTaxDependentChange(event: MatRadioChange)
  {
    this.formGroup.controls.isTaxDependent.setValue(event.value);
  }

  onCumulativeLoanSlidersOutputChange(cumulativeLoanSlidersOutput: CumulativeLoanSlidersOutput)
  {
    this.formGroup.patchValue({
      outOfPocketExpensesByYear: cumulativeLoanSlidersOutput.outOfPocketExpensesByYear,
      federalSubsidizedLoanAmountByYear: cumulativeLoanSlidersOutput.federalSubsidizedLoanAmountByYear,
      federalUnsubsidizedLoanAmountByYear: cumulativeLoanSlidersOutput.federalUnsubsidizedLoanAmountByYear,
      federalLoanAmountByYear: cumulativeLoanSlidersOutput.federalLoanAmountByYear,
      privateLoanAmountByYear: cumulativeLoanSlidersOutput.privateLoanAmountByYear,
      pellGrantAidByYear: cumulativeLoanSlidersOutput.pellGrantAidByYear
    });
  }

  private buildForm()
  {
    const educationFinancing: EducationFinancingDto = this.roiModelDto?.educationFinancing;

    this.formGroup = this.fb.group
      ({
        isTaxDependent: educationFinancing?.isTaxDependent,
        prefersIncomeBasedRepayment: educationFinancing?.prefersIncomeBasedRepayment,
        outOfPocketExpensesByYear: [educationFinancing?.outOfPocketExpensesByYear],
        federalLoanAmountByYear: [educationFinancing?.federalLoanAmountByYear],
        federalSubsidizedLoanAmountByYear: [educationFinancing?.federalSubsidizedLoanAmountByYear],
        federalUnsubsidizedLoanAmountByYear: [educationFinancing?.federalUnsubsidizedLoanAmountByYear],
        privateLoanAmountByYear: [educationFinancing?.privateLoanAmountByYear],
        pellGrantAidByYear: [educationFinancing?.pellGrantAidByYear],
        yearsToPayOffFederalLoan: educationFinancing?.yearsToPayOffFederalLoan,
        yearsToPayOffPrivateLoan: educationFinancing?.yearsToPayOffPrivateLoan
      });

    this.buildValueChange();
  }

  private buildValueChange()
  {
    this.formGroup.valueChanges
      .pipe
      (
        takeWhile(() => this.alive),
        debounceTime(500),
        map(() =>
        {
          this.emitFormSubmission();
        })
      ).subscribe();
  }

  private emitFormSubmission()
  {
    if (this.formSubmissionEventEmitter.observers.length > 0)
    {
      const educationFinancing: EducationFinancingDto =
      {
        isTaxDependent: this.formGroup.controls.isTaxDependent.value,
        prefersIncomeBasedRepayment: this.formGroup.controls.prefersIncomeBasedRepayment.value,
        outOfPocketExpensesByYear: this.formGroup.controls.outOfPocketExpensesByYear.value,
        federalSubsidizedLoanAmountByYear: this.formGroup.controls.federalSubsidizedLoanAmountByYear.value,
        federalUnsubsidizedLoanAmountByYear: this.formGroup.controls.federalUnsubsidizedLoanAmountByYear.value,
        federalLoanAmountByYear: this.formGroup.controls.federalLoanAmountByYear.value,
        privateLoanAmountByYear: this.formGroup.controls.privateLoanAmountByYear.value,
        pellGrantAidByYear: this.formGroup.controls.pellGrantAidByYear.value,
        yearsToPayOffFederalLoan: this.formGroup.controls.yearsToPayOffFederalLoan.value,
        yearsToPayOffPrivateLoan: this.formGroup.controls.yearsToPayOffPrivateLoan.value
      };

      this.formSubmissionEventEmitter.emit(educationFinancing);
    }
  }
}
