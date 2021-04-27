import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'roc-button-with-icon',
  templateUrl: './button-with-icon.component.html',
  styleUrls: ['./button-with-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonWithIconComponent implements OnInit
{
  @Input() title: string;
  @Input() matButtonClass: string;
  @Input() fontSet: string;
  @Input() fontIcon: string;
  @Input() isValid: boolean;
  @Output('onClick') buttonClickEventEmitter = new EventEmitter<null>();

  constructor() { }

  ngOnInit(): void
  {
    this.isValid = this.isValid ?? true;
  }

  onClick(): void
  {
    if (this.buttonClickEventEmitter.observers.length > 0)
    {
      this.buttonClickEventEmitter.emit();
    }
  }

}
