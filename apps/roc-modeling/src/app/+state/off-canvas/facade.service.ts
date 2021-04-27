import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { setOffCanvasClosed, setOffCanvasOpen } from './actions';
import { isOffCanvasOpened } from './selectors';

@Injectable()
export class OffCanvasFacadeService
{

  constructor
    (
      private store: Store
    ) { }


  setOffCanvasOpen()
  {
    this.store.dispatch(setOffCanvasOpen());
  }

  setOffCanvasClosed()
  {
    this.store.dispatch(setOffCanvasClosed());
  }

  isOffCanvasOpened$(): Observable<boolean>
  {
    return this.store.pipe(select(isOffCanvasOpened));
  }
}
