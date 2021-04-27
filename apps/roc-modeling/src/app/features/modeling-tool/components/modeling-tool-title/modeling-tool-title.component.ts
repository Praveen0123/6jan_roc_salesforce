import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'roc-modeling-tool-title',
  templateUrl: './modeling-tool-title.component.html',
  styleUrls: ['./modeling-tool-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelingToolTitleComponent implements OnInit
{
  @Input() ordinalPosition: number;
  @Input() title: string;

  constructor() { }

  ngOnInit(): void
  {
  }
}
