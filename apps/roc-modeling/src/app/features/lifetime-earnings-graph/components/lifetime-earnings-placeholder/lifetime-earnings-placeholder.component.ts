import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'roc-lifetime-earnings-placeholder',
  templateUrl: './lifetime-earnings-placeholder.component.html',
  styleUrls: ['./lifetime-earnings-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LifetimeEarningsPlaceholderComponent implements OnInit
{

  constructor() { }

  ngOnInit(): void
  {
  }

}
