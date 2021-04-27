import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { resetAccordion, setActivePanel } from './actions';
import { selectAccordion } from './selectors';
import { AccordionPanelEnum, AccordionState } from './state';

@Injectable()
export class AccordionFacadeService
{

  constructor
    (
      private store: Store
    ) { }


  setActivePanel(accordionPanel: AccordionPanelEnum)
  {
    this.store.dispatch(setActivePanel({ accordionPanel }));
  }

  resetAccordion()
  {
    this.store.dispatch(resetAccordion());
  }

  getSelectedAccordionModel$(): Observable<AccordionState>
  {
    return this.store.pipe(select(selectAccordion));
  }
}
