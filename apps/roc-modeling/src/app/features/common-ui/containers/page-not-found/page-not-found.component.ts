import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationService } from '@app/core/services';


@Component({
  selector: 'roc-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent implements OnInit
{
  constructor
    (
      private navigationService: NavigationService
    ) { }

  ngOnInit(): void { }

  onGoHome()
  {
    this.navigationService.goToHomePage();
  }
}
