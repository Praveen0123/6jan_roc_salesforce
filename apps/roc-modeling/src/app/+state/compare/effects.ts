import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { addToCompare, loadCompareModel } from './actions';
import { CompareService } from './compare.service';
import { CompareModel } from './state';



@Injectable()
export class CompareStoreEffects
{
  constructor
    (
      private actions$: Actions,
      private compareService: CompareService
    ) { }

  addToCompare$ = createEffect(() => this.actions$.pipe
    (
      ofType(addToCompare),
      map((action) =>
      {
        const compareModel: CompareModel = this.compareService.toCompareModel(action.roiModelDto);
        return loadCompareModel({ compareModel });
      })
    ));
}
