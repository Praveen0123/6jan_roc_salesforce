import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'roc-high-school',
  templateUrl: './high-school.component.html',
  styleUrls: ['./high-school.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighSchoolComponent implements OnInit
{

  constructor() { }

  ngOnInit(): void
  {
  }

}
