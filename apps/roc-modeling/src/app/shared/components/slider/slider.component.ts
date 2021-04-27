import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'roc-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ]
})
export class SliderComponent implements ControlValueAccessor
{
  @Input() label: string;
  @Input() value: number;
  @Input() min: number;
  @Input() max: number;

  @Output() valueChanges = new EventEmitter<number>();

  private propagateChange = (_: any) => { };

  constructor()
  {
    if (this.label === null)
    {
      // tslint:disable-next-line: quotemark
      throw new Error("Attribute 'label' is required");
    }
  }

  onChange(event: MatSliderChange): void
  {
    const value = event.value;
    this.valueChanges.emit(value);
    this.propagateChange(value);
  }

  onInput(event: MatSliderChange): void
  {
    this.value = event.value;
  }

  writeValue(value: any): void
  {
    this.value = value;
  }

  registerOnChange(fn: any): void
  {
    this.propagateChange = fn;
  }

  registerOnTouched(): void { }
}
