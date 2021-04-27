export interface RocChartPlotData
{
  currentState?: RocChartPlotLayer;
  goalState?: RocChartPlotLayer;
  alumniData?: RocChartPlotLayer;
  loanAccumulation?: RocChartPlotLayer;
  loanPayoff?: RocChartPlotLayer;
}

export interface RocChartPlotLayer
{
  primaryColor: string;
  secondaryColor: string;
  secondaryColorOpacity: number;
  values: PlotLayerValueSnapshot[];
}

export interface PlotLayerValueSnapshot
{
  time: number;
  earningsLower: number;
  earningsMedian: number;
  earningsUpper: number;
}
