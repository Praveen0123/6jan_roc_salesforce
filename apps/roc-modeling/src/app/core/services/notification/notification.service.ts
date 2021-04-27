import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationsSnackBarComponent, NotificationsSnackBarModel } from '@app/shared/components/notifications-snack-bar/notifications-snack-bar.component';
import { UseCaseError } from '@vantage-point/ddd-core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService
{

  constructor
    (
      private readonly snackBar: MatSnackBar
    ) { }

  default(message: string, isHandset?: boolean): MatSnackBarRef<NotificationsSnackBarComponent>
  {
    return this.show
      (
        message,
        {
          panelClass: 'notification-overlay-default',
          duration: 5000
        },
        isHandset
      );
  }

  info(message: string, isHandset?: boolean): MatSnackBarRef<NotificationsSnackBarComponent>
  {
    return this.show
      (
        message,
        {
          panelClass: 'notification-overlay-info',
          duration: 5000
        },
        isHandset
      );
  }

  success(message: string, isHandset?: boolean): MatSnackBarRef<NotificationsSnackBarComponent>
  {
    return this.show
      (
        message,
        {
          panelClass: 'notification-overlay-success',
          duration: 2500
        },
        isHandset
      );
  }

  warn(message: string, isHandset?: boolean): MatSnackBarRef<NotificationsSnackBarComponent>
  {
    return this.show
      (
        message,
        {
          panelClass: 'notification-overlay-warning',
          duration: 5000
        },
        isHandset
      );
  }

  error(useCaseError: UseCaseError | Error, isHandset?: boolean): MatSnackBarRef<NotificationsSnackBarComponent>
  {
    return this.show
      (
        useCaseError.message,
        {
          panelClass: 'notification-overlay-error'
        },
        isHandset,
        useCaseError
      );
  }



  private show
    (
      message: string,
      configuration: MatSnackBarConfig,
      isHandset?: boolean,
      useCaseError?: UseCaseError | Error
    ): MatSnackBarRef<NotificationsSnackBarComponent>
  {
    // If desktop, move it to top-center
    if (!isHandset)
    {
      configuration.horizontalPosition = 'center';
      configuration.verticalPosition = 'top';
    }

    const duration: number = (configuration.duration) ? configuration.duration : null;

    const model: NotificationsSnackBarModel =
    {
      message: message,
      error: useCaseError
    };

    const config: MatSnackBarConfig =
    {
      ...configuration,
      duration: duration,
      data: model
    };

    // return this.snackBar.open(message, action, configuration);
    return this.snackBar.openFromComponent(NotificationsSnackBarComponent, config);
  }
}
