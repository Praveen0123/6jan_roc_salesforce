import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'roc-owl-icon',
  templateUrl: './owl-icon.component.html',
  styleUrls: ['./owl-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwlIconComponent implements OnInit
{

  constructor() { }

  ngOnInit(): void
  {
  }

}
