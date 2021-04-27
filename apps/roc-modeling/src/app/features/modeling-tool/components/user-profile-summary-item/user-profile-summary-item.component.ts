import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'roc-user-profile-summary-item',
  templateUrl: './user-profile-summary-item.component.html',
  styleUrls: ['./user-profile-summary-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileSummaryItemComponent implements OnInit
{
  @Input() title: string;
  @Input() subTitle: string;

  constructor() { }

  ngOnInit(): void
  {
  }

}
