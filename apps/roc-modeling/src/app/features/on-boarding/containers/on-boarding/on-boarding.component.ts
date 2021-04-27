import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'roc-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnBoardingComponent implements OnInit
{

  constructor() { }

  ngOnInit(): void
  {
  }

}
