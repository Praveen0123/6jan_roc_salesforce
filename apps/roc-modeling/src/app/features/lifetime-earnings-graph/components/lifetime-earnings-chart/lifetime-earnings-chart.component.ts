import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PlotLayerValueSnapshot, RocChartPlotData, RocChartPlotLayer, RocChartPlotMarker, RocPlotsVisibility } from '@app/domain/roi-model/models';
import * as d3 from 'd3';

@Component({
  selector: 'roc-lifetime-earnings-chart',
  templateUrl: './lifetime-earnings-chart.component.html',
  styleUrls: ['./lifetime-earnings-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LifetimeEarningsChartComponent implements OnChanges
{
  @Input() chartPlotData: RocChartPlotData;
  @Input() roiSectionsVisibility: RocPlotsVisibility;

  @Output() rocChartClick = new EventEmitter<RocChartPlotMarker>();

  private initialized = false;

  private svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private xScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;
  private mouseG: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

  private margin = { top: 7, right: 30, bottom: 30, left: 91 };
  private width = 750 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  initializeChart(): void
  {
    // set the dimensions and margins of the graph

    // append the svg object to the body of the page
    this.svg = d3
      .select('#lifetime-earnings-chart')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    // Initialize an X axis:
    this.xScale = d3.scaleLinear().range([0, this.width]);
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .attr('class', 'x-axis');

    // text label for the x axis
    this.svg
      .append('text')
      .attr('font-size', '14px')
      .attr(
        'transform',
        'translate(' +
        this.width / 2 +
        ' ,' +
        (this.height + this.margin.top + 20) +
        ')'
      )
      .style('text-anchor', 'middle')
      .text('Working Years');

    // Initialize an Y axis
    this.yScale = d3.scaleLinear().range([this.height, 0]);
    // const yAxis = d3.axisLeft().scale(y);
    this.svg.append('g').attr('class', 'y-axis');

    // text label for the y axis
    this.svg
      .append('text')
      .attr('font-size', '14px')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Lifetime Earnings');
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.chartPlotData || changes.roiSectionsVisibility)
    {
      if (!this.initialized)
      {
        this.initializeChart();
        this.initialized = true;
      }

      this.update(this.chartPlotData);
    }
  }

  update(chartPlotData: RocChartPlotData): void
  {
    // Create the X axis:
    this.xScale.domain(
      d3.extent(
        chartPlotData.currentState.values,
        (snap: PlotLayerValueSnapshot) => snap.time
      )
    );
    this.svg
      .selectAll('.x-axis')
      .transition()
      .duration(1000)
      .call(d3.axisBottom(this.xScale).bind(this));

    const allValues = [
      ...(chartPlotData.currentState?.values || []),
      ...(chartPlotData.goalState?.values || []),
      ...(chartPlotData.alumniData?.values || []),
      ...(chartPlotData.loanAccumulation?.values || []),
      ...(chartPlotData.loanPayoff?.values || [])
    ];

    // create the Y axis
    this.yScale.domain([
      d3.min(
        allValues,
        (snap: PlotLayerValueSnapshot) => snap.earningsLower
      ),
      d3.max(
        allValues,
        (snap: PlotLayerValueSnapshot) => snap.earningsUpper
      ),
    ]);
    this.svg
      .selectAll('.y-axis')
      .transition()
      .duration(1000)
      .call(d3.axisLeft(this.yScale).bind(this));


    if (chartPlotData.currentState && chartPlotData.currentState.values)
    {
      this.updateCurrentState(chartPlotData.currentState.values);
    }

    if (chartPlotData.goalState && chartPlotData.goalState.values)
    {
      this.updateGoalState(chartPlotData.goalState.values);
    }

    if (chartPlotData.alumniData)
    {
      // TODO: create this alumni function
      // this.updateAlumniData(chartPlotData.alumniData);
    }

    if (chartPlotData.loanAccumulation)
    {
      this.updateLoanAccumulation(chartPlotData.loanAccumulation);
    }

    if (chartPlotData.loanPayoff)
    {
      // TODO: create this alumni function
      // this.updateLoanPayoff(chartPlotData.loanPayoff);
    }

    this.updateHoverContent(chartPlotData);
  }

  private updateHoverContent(chartPlotData: RocChartPlotData): void
  {

    const hoverContent = [
      chartPlotData.currentState,
      chartPlotData.goalState,
      chartPlotData.alumniData,
      chartPlotData.loanAccumulation,
      chartPlotData.loanPayoff,
    ].filter(x => !!x);

    if (!this.mouseG)
    {
      this.mouseG = this.svg.append('g').attr('class', 'mouse-over-effects');

      this.mouseG
        .append('path') // create vertical line to follow mouse
        .attr('class', 'mouse-line text-gray-600')
        .style('stroke', 'currentColor')
        .style('stroke-width', '2px')
        .style('opacity', '0');
    }

    const mousePerLine = this.mouseG
      .selectAll('.mouse-per-line')
      .data(hoverContent);

    mousePerLine
      .enter()
      .append<d3.BaseType>('g')
      .merge(mousePerLine)
      .attr('class', 'mouse-per-line')
      .append('circle')
      .attr('r', 4)
      .style('stroke', 'black')
      .style('fill', 'white')
      .style('stroke-width', '2px')
      .style('opacity', '0');

    mousePerLine.exit().remove();

    this.mouseG
      .select('.mouse-event-catch').remove();

    this.mouseG
      .append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'mouse-event-catch')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function ()
      {
        // on mouse out hide line, circles and text
        d3.select('.mouse-line').style('opacity', '0');
        d3.selectAll('.mouse-per-line circle').style('opacity', '0');
        d3.selectAll('.mouse-per-line text').style('opacity', '0');
        d3.selectAll('#tooltip').style('display', 'none');
      })
      .on('mouseover', function ()
      {
        // on mouse in show line, circles and text
        d3.select('.mouse-line').style('opacity', '1');
        d3.selectAll('.mouse-per-line circle').style('opacity', '1');
        d3.selectAll('#tooltip').style('display', 'block');
      })
      .on('mousemove', (event: MouseEvent) =>
      {
        // update tooltip content, line, circles and text when mouse moves
        const mouse: [number, number] = (<any>d3).pointer(event);
        const xDate = this.xScale.invert(mouse[0]); // use 'invert' to get date corresponding to distance from mouse position relative to svg
        d3.selectAll('.mouse-per-line').attr(
          'transform',
          (l: RocChartPlotLayer) =>
          {
            if (l && l.values)
            {
              const bisect = d3.bisector((vs: PlotLayerValueSnapshot) =>
              {
                return vs.time;
              }).left; // retrieve row index
              const idx = bisect(l.values, xDate);
              d3.select('.mouse-line').attr('d', () =>
              {
                let d = 'M' + mouse[0] + ',' + this.height;
                d += ' ' + mouse[0] + ',' + 0;
                return d;
              });
              return (
                'translate(' +
                this.xScale(l.values[idx].time - 0.05) +
                ',' +
                this.yScale(l.values[idx].earningsMedian) +
                ')'
              );
            }
          }
        );
      })
      .on('click', (mouseEvent: MouseEvent) =>
      {
        // update tooltip content, line, circles and text when mouse moves
        const mouseCoordinates: [x: number, y: number] = (<any>d3).pointer(mouseEvent);
        const xDate = this.xScale.invert(mouseCoordinates[0]);
        const bisect = d3.bisector((vs: PlotLayerValueSnapshot) =>
        {
          return vs.time;
        }).left; // retrieve row index
        const idx = bisect(chartPlotData.currentState?.values, xDate);
        this.rocChartClick.emit({ mouseEvent, idx });
      });
  }

  private updateGoalState(goalStateValues: PlotLayerValueSnapshot[]): void
  {
    // Create a update selection: bind to the new data
    const u = this.svg
      .selectAll('.goalState-earningsMedian')
      .data(
        [goalStateValues],
        (vs: PlotLayerValueSnapshot) => vs.time
      );
    const b = this.svg
      .selectAll('.goalState-earningsBands')
      .data(
        [goalStateValues],
        (vs: PlotLayerValueSnapshot) => vs.time
      );

    const medianLine = d3
      .line<PlotLayerValueSnapshot>()
      .x((vs: PlotLayerValueSnapshot) => this.xScale(vs.time))
      .y((vs: PlotLayerValueSnapshot) => this.yScale(vs.earningsMedian));

    const confidenceBands = d3
      .area<PlotLayerValueSnapshot>()
      .x((vs: PlotLayerValueSnapshot) => this.xScale(vs.time))
      .y0((vs: PlotLayerValueSnapshot) => this.yScale(vs.earningsUpper))
      .y1((vs: PlotLayerValueSnapshot) => this.yScale(vs.earningsLower));

    // Update the bands
    b.enter()
      .append<d3.BaseType>('path')
      .attr('class', 'goalState-earningsBands text-goalState-secondary')
      .merge(b)
      .transition()
      .duration(1000)
      .attr('d', confidenceBands)
      .style('fill', 'currentColor')
      .attr('stroke', 'none')
      .attr('stroke-width', 2.5);

    // Update the line
    u.enter()
      .append<d3.BaseType>('path')
      .attr('class', 'goalState-earningsMedian text-goalState-primary')
      .merge(u)
      .transition()
      .duration(1000)
      .attr('d', medianLine)
      .attr('fill', 'none')
      .style('stroke', 'currentColor')
      .style('stroke-dasharray', '4, 6')
      .style('stroke-width', '2');
  }

  private updateCurrentState(currentStateValues: PlotLayerValueSnapshot[]): void
  {
    // Create a update selection: bind to the new data
    const u = this.svg
      .selectAll('.currentState-earningsMedian')
      .data(
        [currentStateValues],
        (sv: PlotLayerValueSnapshot) => sv.time
      );
    const b = this.svg
      .selectAll('.currentState-earningsBands')
      .data(
        [currentStateValues],
        (sv: PlotLayerValueSnapshot) => sv.time
      );

    const medianLine = d3
      .line<PlotLayerValueSnapshot>()
      .x((sv: PlotLayerValueSnapshot) => this.xScale(sv.time))
      .y((sv: PlotLayerValueSnapshot) => this.yScale(sv.earningsMedian));

    const confidenceBands = d3
      .area<PlotLayerValueSnapshot>()
      .x((sv: PlotLayerValueSnapshot) => this.xScale(sv.time))
      .y0((sv: PlotLayerValueSnapshot) => this.yScale(sv.earningsUpper))
      .y1((sv: PlotLayerValueSnapshot) => this.yScale(sv.earningsLower));

    // Update the bands
    b.enter()
      .append<d3.BaseType>('path')
      .attr('class', 'currentState-earningsBands text-currentState-secondary')
      .merge(b)
      .transition()
      .duration(1000)
      .attr('d', confidenceBands)
      .style('fill', 'currentColor')
      .attr('stroke', 'none')
      .attr('stroke-width', 2.5);

    // Update the line
    u.enter()
      .append<d3.BaseType>('path')
      .attr('class', 'currentState-earningsMedian text-currentState-primary')
      .merge(u)
      .transition()
      .duration(1000)
      .attr('d', medianLine)
      .attr('fill', 'none')
      .style('stroke', 'currentColor')
      .style('stroke-dasharray', '4, 6')
      .style('stroke-width', '2');
  }

  private updateLoanAccumulation(loanAccumulationLayer: RocChartPlotLayer): void
  {
    if (loanAccumulationLayer.values)
    {
      // Create a update selection: bind to the new data
      const u = this.svg
        .selectAll('.loansState')
        .data(
          [loanAccumulationLayer.values],
          (sv: PlotLayerValueSnapshot) => sv.time
        );

      const avgLine = d3
        .line<PlotLayerValueSnapshot>()
        .x((sv: PlotLayerValueSnapshot) => this.xScale(sv.time))
        .y((sv: PlotLayerValueSnapshot) => this.yScale(sv.earningsMedian));

      // Update the line
      u.enter()
        .append<d3.BaseType>('path')
        .attr('class', 'loansState text-loansAccumulation-primary')
        .merge(u)
        .transition()
        .duration(1000)
        .attr('d', avgLine)
        .attr('fill', 'none')
        .style('stroke', 'currentColor')
        .style('stroke-dasharray', '4, 6')
        .style('stroke-width', '2');

    }
  }
}
