import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UseCaseError } from '@vantage-point/ddd-core';
import { Observable } from 'rxjs';

import { clearError, setError } from './actions';
import { errorState } from './selectors';

@Injectable()
export class ErrorsFacadeService
{

  constructor
    (
      private store: Store
    ) { }


  setError(useCaseError: UseCaseError)
  {
    this.store.dispatch(setError({ useCaseError }));
  }

  clearError()
  {
    this.store.dispatch(clearError());
  }

  getError$(): Observable<UseCaseError>
  {
    return this.store.pipe(select(errorState));
  }
}
