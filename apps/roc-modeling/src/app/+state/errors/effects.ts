import { Injectable } from '@angular/core';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import { setError } from './actions';


@Injectable()
export class ErrorsEffects
{

  constructor
    (
      private actions$: Actions,
      private notificationService: NotificationService
    ) { }

  setError$ = createEffect(() => this.actions$.pipe
    (
      ofType(setError),
      switchMap((action) => this.notificationService.error(action.useCaseError).afterDismissed()),
      map(() =>
      {
      })
    ), { dispatch: false }
  );

}
