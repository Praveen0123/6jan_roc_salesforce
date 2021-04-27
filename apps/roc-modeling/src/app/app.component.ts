import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { FontAwesomeIconRegistryService } from '@core/services/icon-registry/font-awesome-icon-registry.service';
import { UseCaseError } from '@vantage-point/ddd-core';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import { OffCanvasFacadeService } from './+state/off-canvas';
import { UserFacadeService } from './+state/user';
import { NotificationService } from './core/services/notification/notification.service';
import { RoiModelService } from './domain';


@Component({
  selector: 'roc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy
{
  private alive: boolean = true;

  isAuthenticated$: Observable<boolean>;
  hasCompletedOnboarding$: Observable<boolean>;
  isOffCanvasOpen$: Observable<boolean>;

  constructor
    (
      private fontAwesomeIconRegistryService: FontAwesomeIconRegistryService,
      private userFacadeService: UserFacadeService,
      private offCanvasFacadeService: OffCanvasFacadeService,
      private roiModelService: RoiModelService,
      private notificationService: NotificationService,
      private authService: AuthService
    )
  {
    this.fontAwesomeIconRegistryService.init();
  }

  ngOnInit(): void
  {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.hasCompletedOnboarding$ = this.userFacadeService.hasCompletedOnboarding$();
    this.isOffCanvasOpen$ = this.offCanvasFacadeService.isOffCanvasOpened$();

    this.roiModelService.roiModelError$
      .pipe
      (
        takeWhile(() => this.alive),
        map((err: UseCaseError) =>
        {
          if (err)
          {
            this.notificationService.error(err);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void
  {
    this.alive = false;
  }

  onShowSaved(isOpen: boolean)
  {
    if (isOpen)
    {
      this.offCanvasFacadeService.setOffCanvasOpen();
    }
    else
    {
      this.offCanvasFacadeService.setOffCanvasClosed();
    }
  }

}
