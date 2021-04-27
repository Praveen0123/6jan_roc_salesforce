import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'roc-compare-section',
  templateUrl: './compare-section.component.html',
  styleUrls: ['./compare-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompareSectionComponent implements OnInit
{
  @Input() title: string;
  @Input() compareTemplate: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void
  {
  }

}
