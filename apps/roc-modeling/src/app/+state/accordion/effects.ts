import { Injectable } from '@angular/core';
import { RoiModelService } from '@app/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { switchMap, withLatestFrom } from 'rxjs/operators';

import { checkRoiModelValidity, determineActiveAccordionPanel, setActivePanel, setCareerGoalValidity, setCurrentInformationValidity, setEducationCostValidity } from '../accordion/actions';
import { selectActiveAccordionPanel } from './selectors';
import { AccordionPanelEnum } from './state';


@Injectable()
export class AccordionEffects
{

  constructor
    (
      private store: Store,
      private actions$: Actions,
      private roiModelService: RoiModelService
    ) { }

  checkRoiModelValidity$ = createEffect(() => this.actions$.pipe
    (
      ofType(checkRoiModelValidity),
      switchMap(() =>
      {
        const isCurrentInformationValid: boolean = this.roiModelService.isCurrentInformationValid();
        const isCareerGoalValid: boolean = this.roiModelService.isCareerGoalValid();
        const isEducationCostValid: boolean = this.roiModelService.isEducationCostValid();

        return [
          setCurrentInformationValidity({ isCurrentInformationValid }),
          setCareerGoalValidity({ isCareerGoalValid }),
          setEducationCostValidity({ isEducationCostValid })
        ];
      })
    ));

  determineActiveAccordionPanel$ = createEffect(() => this.actions$.pipe
    (
      ofType(determineActiveAccordionPanel),
      withLatestFrom
        (
          this.store.pipe(select(selectActiveAccordionPanel))
        ),
      switchMap(([_, activeAccordionPanel]) =>
      {
        const isCurrentInformationValid: boolean = this.roiModelService.isCurrentInformationValid();
        const isCareerGoalValid: boolean = this.roiModelService.isCareerGoalValid();
        const isEducationCostValid: boolean = this.roiModelService.isEducationCostValid();

        let accordionPanel: AccordionPanelEnum = (!isCurrentInformationValid) ? AccordionPanelEnum.CURRENT_INFORMATION
          : (!isCareerGoalValid) ? AccordionPanelEnum.CAREER_GOAL
            : (!isEducationCostValid) ? AccordionPanelEnum.EDUCATION_COST
              : activeAccordionPanel;


        return [setActivePanel({ accordionPanel })];
      })
    ));

}
