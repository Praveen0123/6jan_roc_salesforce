import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'roc-wait-for-validation',
  templateUrl: './wait-for-validation.component.html',
  styleUrls: ['./wait-for-validation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaitForValidationComponent implements OnInit
{

  constructor() { }

  ngOnInit(): void
  {
  }

}
