import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { CurrencySuffixPipe } from '../currency-suffix/currency-suffix.pipe';


/************************************************************************************

SOURCED FROM:

https://www.cssscript.com/demo/circular-range-slider-svg/


************************************************************************************/

export enum StartingPositionEnum
{
  TOP = 270,
  BOTTOM = 90,
  LEFT = 180,
  RIGHT = 0
}

export interface XYCoordinates
{
  x: number,
  y: number;
}

@Component({
  selector: 'roc-lib-slider-circle',
  templateUrl: './slider-circle.component.html',
  styleUrls: ['./slider-circle.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SliderCircleComponent implements OnInit, AfterViewInit, OnChanges
{
  private sliderGroup: SVGGElement;
  private cx: number;                                 // Slider center X coordinate
  private cy: number;                                 // Slider center Y coordinate
  private tau: number = 2 * Math.PI;                  // Tau constant
  private arcFractionSpacing: number = 0.85;          // Spacing between arc fractions
  private arcFractionLength: number = 0;              // Arc fraction length
  private arcFractionThickness: number = 10;          // Arc fraction thickness
  private arcBgFractionColor: string = '#D8D8D8';     // Arc fraction color for background slider
  private handleFillColor: string = '#fff';           // Slider handle fill color
  private handleStrokeColor: string = '#888888';      // Slider handle stroke color
  private handleStrokeThickness: number = 3;          // Slider handle stroke thickness
  private mouseDown: boolean = false;                 // Is mouse down


  private sliderControlValue: number;

  @Input() sliderWidth: number;
  @Input() sliderHeight: number;
  @Input() radius: number;
  @Input() minimum: number;
  @Input() maximum: number;
  @Input() step: number;
  @Input() initialValue: number;
  @Input() color: string;
  @Input() isInteractive: boolean;

  @Output('input') valueWhileMovingEventEmitter = new EventEmitter<number>();
  @Output('change') valueWhenFinishedMovingEventEmitter = new EventEmitter<number>();

  @ViewChild("slider") sliderElement: ElementRef;
  @ViewChild("sliderContainer") sliderContainerElement: ElementRef;
  @ViewChild("sliderSvg") sliderSvgElement: ElementRef;

  constructor
    (
      private currencySuffixPipe: CurrencySuffixPipe
    )
  {
  }

  ngOnInit(): void
  {
    this.sliderWidth = this.sliderWidth ?? 100;
    this.sliderHeight = this.sliderHeight ?? 100;
    this.radius = this.radius ?? 40;
    this.minimum = this.minimum ?? 0;
    this.maximum = this.maximum ?? 1000;
    this.step = this.step ?? 50;
    this.initialValue = this.initialValue ?? 0;
    this.color = this.color ?? '#FF5733';
    this.isInteractive = this.isInteractive ?? true;
    this.cx = this.sliderWidth / 2;
    this.cy = this.sliderHeight / 2;
    this.sliderControlValue = this.initialValue;
  }

  ngAfterViewInit()
  {
    // Create and append SVG holder
    this.sliderSvgElement.nativeElement.setAttribute('height', this.sliderWidth.toString());
    this.sliderSvgElement.nativeElement.setAttribute('width', this.sliderHeight.toString());


    // Draw sliders
    this.drawSlider(this.initialValue);


    // Event listeners
    if (this.isInteractive)
    {
      this.sliderContainerElement.nativeElement.addEventListener('mousedown', this.mouseTouchStart.bind(this), false);
      this.sliderContainerElement.nativeElement.addEventListener('touchstart', this.mouseTouchStart.bind(this), false);
      this.sliderContainerElement.nativeElement.addEventListener('mousemove', this.mouseTouchMove.bind(this), false);
      this.sliderContainerElement.nativeElement.addEventListener('touchmove', this.mouseTouchMove.bind(this), false);
      window.addEventListener('mouseup', this.mouseTouchEnd.bind(this), false);
      window.addEventListener('touchend', this.mouseTouchEnd.bind(this), false);
    }
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.initialValue && !changes.initialValue.firstChange)
    {
      this.reDrawSliderFromValueChange(this.initialValue);
    }
  }

  /**
   * Draw single slider on init
   *
   * @param {object} svg: SVGSVGElement
   * @param {object} slider
   * @param {number} index
   */
  private drawSlider(value: number)
  {
    // Calculate slider circumference
    const circumference = this.radius * this.tau;

    // Calculate initial angle
    const initialAngle = this.convertValueToAngle(value);

    // Calculate spacing between arc fractions
    const arcFractionSpacing = this.calculateSpacingBetweenArcFractions(circumference, this.arcFractionLength, this.arcFractionSpacing);

    // Create a single slider group - holds all paths and handle
    this.sliderGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.sliderGroup.setAttribute('class', 'sliderSingle');
    this.sliderGroup.setAttribute('data-slider', '0');
    this.sliderGroup.setAttribute('transform', 'rotate(-90,' + this.cx + ',' + this.cy + ')');
    this.sliderGroup.setAttribute('rad', this.radius.toString());
    this.sliderSvgElement.nativeElement.appendChild(this.sliderGroup);

    // Draw background arc path
    this.drawArcPath(this.arcBgFractionColor, this.radius, 360, arcFractionSpacing, 'bg', this.sliderGroup);

    // Draw active arc path
    this.drawArcPath(this.color, this.radius, initialAngle, arcFractionSpacing, 'active', this.sliderGroup);

    // Draw handle
    this.drawHandle(initialAngle, this.sliderGroup);

    // Draw value
    this.drawValue(value, this.sliderGroup);
  }

  /**
   * Output arch path
   *
   * @param {number} cx
   * @param {number} cy
   * @param {string} color
   * @param {number} angle
   * @param {number} singleSpacing
   */
  private drawArcPath(color: string, radius: number, angle: number, singleSpacing: number, type: string, group: SVGGElement)
  {
    // Slider path class
    const pathClass = (type === 'active') ? 'sliderSinglePathActive' : 'sliderSinglePath';

    // Create svg path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add(pathClass);
    path.setAttribute('d', this.describeArc(this.cx, this.cy, radius, 0, angle));
    path.style.stroke = color;
    path.style.strokeWidth = this.arcFractionThickness.toString();
    path.style.fill = 'none';
    path.setAttribute('stroke-dasharray', this.arcFractionLength + ' ' + singleSpacing);

    group.appendChild(path);
  }

  /**
   * Draw handle for single slider
   *
   * @param {number} initialAngle
   * @param {group} group
   */
  private drawHandle(initialAngle: number, group: SVGGElement)
  {
    // Calculate handle center
    const handleCenter: XYCoordinates = this.calculateHandleCenter(initialAngle * this.tau / 360, this.radius);

    // Draw handle
    const handle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    handle.setAttribute('class', 'sliderHandle');
    handle.setAttribute('cx', handleCenter.x.toString());
    handle.setAttribute('cy', handleCenter.y.toString());
    handle.setAttribute('r', (this.arcFractionThickness / 2).toString());
    handle.style.stroke = this.handleStrokeColor;
    handle.style.strokeWidth = this.handleStrokeThickness.toString();
    handle.style.fill = this.handleFillColor;

    group.appendChild(handle);
  }


  /**
 * Draw value of slider as text
 *
 * @param {number} initialAngle
 * @param {group} group
 */
  private drawValue(initialAngle: number, group: SVGGElement)
  {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('class', 'sliderValue');
    text.setAttribute('x', '50%');
    text.setAttribute('y', '50%');
    text.setAttribute('fill', this.color);
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('transform', 'rotate(90,' + this.cx + ',' + this.cy + ')');

    group.appendChild(text);

    this.setValueInUi(initialAngle);
  }




  /**
   * Redraw slider from mouse movement
   *
   * @param {obj} rmc
   */
  private reDrawSliderFromMouseCoordinates(rmc: XYCoordinates)
  {
    const currentAngle = this.calculateMouseAngle(rmc) * 0.999;
    const currentValue: number = this.convertAngleToValue(currentAngle);

    const path = this.sliderSvgElement.nativeElement.querySelector('.sliderSinglePathActive');
    const radius = +this.sliderGroup.getAttribute('rad');
    // Redraw active path
    path.setAttribute('d', this.describeArc(this.cx, this.cy, radius, 0, this.radiansToDegrees(currentAngle)));

    // Redraw handle
    const handle: Element = this.sliderSvgElement.nativeElement.querySelector('.sliderHandle');
    const handleCenter = this.calculateHandleCenter(currentAngle, radius);

    handle.setAttribute('cx', handleCenter.x.toString());
    handle.setAttribute('cy', handleCenter.y.toString());

    // Redraw value
    this.setValueInUi(currentValue);

    // Update legend
    this.emitValueWhileMoving(currentValue);
  }


  /**
   * Redraw slider from input value
   *
   * @param {obj} inputValue
   */
  private reDrawSliderFromValueChange(inputValue: number)
  {
    const currentAngle: number = this.convertValueToAngle(inputValue) * 0.999;

    // Redraw path
    const path = this.sliderSvgElement.nativeElement.querySelector('.sliderSinglePathActive');
    path.setAttribute('d', this.describeArc(this.cx, this.cy, this.radius, 0, currentAngle));

    // Redraw handle
    const handle: Element = this.sliderSvgElement.nativeElement.querySelector('.sliderHandle');
    const handleCenter: XYCoordinates = this.calculateHandleCenter(currentAngle * this.tau / 360, this.radius);

    handle.setAttribute('cx', handleCenter.x.toString());
    handle.setAttribute('cy', handleCenter.y.toString());

    // Redraw value
    this.setValueInUi(inputValue);
  }


  /**
   * CONVERT VALUE TO CURRENCY + SUFFIX IN UI
   *
   * @param {number} currentAngle
   */
  private setValueInUi(currentValue: number): void
  {
    const text: Element = this.sliderSvgElement.nativeElement.querySelector('.sliderValue');
    text.textContent = this.currencySuffixPipe.transform(currentValue);
  }



  /**
   * CONVERT CURRENT ANGLE TO VALUE
   *
   * @param {number} currentAngle
   */
  private convertAngleToValue(currentAngle: number): number
  {
    const currentSliderRange = this.maximum - this.minimum;
    let currentValue = currentAngle / this.tau * currentSliderRange;
    const numOfSteps = Math.round(currentValue / this.step);

    currentValue = this.minimum + numOfSteps * this.step;

    return currentValue;
  }

  /**
   * CONVERT VALUE TO ANGLE
   *
   * @param {number} currentAngle
   */
  private convertValueToAngle(value: number): number
  {
    const currentSliderRange = this.maximum - this.minimum;

    if (currentSliderRange > 0)
    {
      return Math.floor((value / currentSliderRange) * 360);
    }

    return 0;
  }

  /**
   * CALL OUTPUT
   *
   * @param {number} currentValue
   */
  private emitValueWhileMoving(currentValue: number)
  {
    this.sliderControlValue = currentValue;

    if (this.valueWhileMovingEventEmitter.observers.length > 0)
    {
      this.valueWhileMovingEventEmitter.emit(currentValue);
    }
  }

  /**
   * CALL OUTPUT
   *
   * @param {number} currentValue
   */
  private emitValueWhenFinishedMoving()
  {
    if (this.valueWhenFinishedMovingEventEmitter.observers.length > 0)
    {
      setTimeout((() =>
      {
        this.valueWhenFinishedMovingEventEmitter.emit(this.sliderControlValue);
      }), 500);
    }
  }


  /**
   * Mouse down / Touch start event
   *
   * @param {object} e
   */
  private mouseTouchStart(e: Event)
  {
    if (this.mouseDown) return;

    this.mouseDown = true;
    const rmc = this.getRelativeMouseCoordinates(e);
    this.reDrawSliderFromMouseCoordinates(rmc);
  }

  /**
   * Mouse move / touch move event
   *
   * @param {object} e
   */
  private mouseTouchMove(e: Event)
  {
    if (!this.mouseDown) return;

    e.preventDefault();
    const rmc = this.getRelativeMouseCoordinates(e);
    this.reDrawSliderFromMouseCoordinates(rmc);
  }

  /**
   * Mouse move / touch move event
   * Deactivate slider
   *
   */
  private mouseTouchEnd()
  {
    if (!this.mouseDown) return;

    this.mouseDown = false;
    this.emitValueWhenFinishedMoving();
  }

  /**
   * Calculate number of arc fractions and space between them
   *
   * @param {number} circumference
   * @param {number} arcBgFractionLength
   * @param {number} arcBgFractionBetweenSpacing
   *
   * @returns {number} arcFractionSpacing
   */
  private calculateSpacingBetweenArcFractions(circumference: number, arcBgFractionLength: number, arcBgFractionBetweenSpacing: number)
  {
    if (arcBgFractionLength > 0)
    {
      const numFractions = Math.floor((circumference / arcBgFractionLength) * arcBgFractionBetweenSpacing);
      const totalSpacing = circumference - numFractions * arcBgFractionLength;
      return totalSpacing / numFractions;
    }

    return 0;
  }

  /**
   * Helper function - describe arc
   *
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} startAngle
   * @param {number} endAngle
   *
   * @returns {string} path
   */
  private describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number)
  {
    let endAngleOriginal, start, end, arcSweep, path;
    endAngleOriginal = endAngle;

    if (endAngleOriginal - startAngle === 360)
    {
      endAngle = 359;
    }

    start = this.polarToCartesian(x, y, radius, endAngle);
    end = this.polarToCartesian(x, y, radius, startAngle);
    arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

    if (endAngleOriginal - startAngle === 360)
    {
      path = [
        'M', start.x, start.y,
        'A', radius, radius, 0, arcSweep, 0, end.x, end.y, 'z'
      ].join(' ');
    } else
    {
      path = [
        'M', start.x, start.y,
        'A', radius, radius, 0, arcSweep, 0, end.x, end.y
      ].join(' ');
    }

    return path;
  }

  /**
   * Helper function - polar to cartesian transformation
   *
   * @param {number} centerX
   * @param {number} centerY
   * @param {number} radius
   * @param {number} angleInDegrees
   *
   * @returns {object} coords
   */
  private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): XYCoordinates
  {
    const angleInRadians = angleInDegrees * Math.PI / 180;
    const x = centerX + (radius * Math.cos(angleInRadians));
    const y = centerY + (radius * Math.sin(angleInRadians));
    return { x, y };
  }

  /**
   * Helper function - calculate handle center
   *
   * @param {number} angle
   * @param {number} radius
   *
   * @returns {object} coords
   */
  private calculateHandleCenter(angle: number, radius: number): XYCoordinates
  {
    const x: number = this.cx + Math.cos(angle) * radius;
    const y: number = this.cy + Math.sin(angle) * radius;

    return { x, y };
  }

  /**
   * Get mouse coordinates relative to the top and left of the container
   *
   * @param {object} e
   *
   * @returns {object} coords
   */
  private getRelativeMouseCoordinates(e: Event)
  {
    const containerRect = this.sliderContainerElement.nativeElement.getBoundingClientRect();
    const mouseEvent: MouseEvent = e as MouseEvent;
    const x = mouseEvent.clientX - containerRect.left;
    const y = mouseEvent.clientY - containerRect.top;
    return { x, y };
  }

  /**
   * Calculate mouse angle in radians
   *
   * @param {object} rmc
   *
   * @returns {number} angle
   */
  private calculateMouseAngle(rmc: XYCoordinates): number
  {
    const angle = Math.atan2(rmc.y - this.cy, rmc.x - this.cx);

    if (angle > - this.tau / 2 && angle < - this.tau / 4)
    {
      return angle + this.tau * 1.25;
    }
    else
    {
      return angle + this.tau * 0.25;
    }
  }

  /**
   * Helper function - transform radians to degrees
   *
   * @param {number} angle
   *
   * @returns {number} angle
   */
  private radiansToDegrees(angle: number)
  {
    return angle / (Math.PI / 180);
  }

}
