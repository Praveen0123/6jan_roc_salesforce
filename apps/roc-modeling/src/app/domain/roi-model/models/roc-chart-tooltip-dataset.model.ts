import { RocPlotsVisibility } from './roc-plots-visibility.model';

export interface RocChartPopoverData
{
  time: number;
  mouseEvent: MouseEvent;
  monthlySalary: PopoverDatasetWithRange;
  monthlyLivingExpense: PopoverDatasetWithCaption;
  monthlyLoanPayment: PopoverDatasetWithCaption;
  monthlyDisposableIncome: PopoverDataset;
  rocPlotsVisibility: RocPlotsVisibility;
  currentStateOccupationTitle: string;
  goalStateOccupationTitle: string;
}

export interface PopoverDataset
{
  currentStateMedian: number;
  goalStateMedian: number;
  alumniStateValue: number;
}

export interface PopoverDatasetWithRange extends PopoverDataset
{
  currentStateLower: number;
  currentStateUpper: number;
  goalStateLower: number;
  goalStateUpper: number;
}

export interface PopoverDatasetWithCaption extends PopoverDataset
{
  currentStateCaption: string;
  goalStateCaption: string;
  alumniStateCaption: string;
}
