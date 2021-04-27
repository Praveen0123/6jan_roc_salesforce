import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'roc-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit
{

  constructor() { }

  ngOnInit(): void
  {
  }

}
