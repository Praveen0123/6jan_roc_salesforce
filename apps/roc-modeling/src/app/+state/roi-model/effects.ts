import { Injectable } from '@angular/core';
import { CareerGoalForm, CurrentInformationForm, EducationCostForm } from '@app/core/models';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { CareerGoalDto, CurrentInformationDto, EducationCostDto, LifetimeEarningsService, RoiModelDto, RoiModelService, RoiModelToSaveDto } from '@app/domain';
import { ExchangeAutoCompleteForLocationGQL, ExchangeAutoCompleteForOccupationGQL, InstitutionByUnitIdGQL, InstructionalProgramGQL, RoiModelGQL, RoiModelInput, SaveRoiModelGQL } from '@gql';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { AutoCompleteModel } from '@vantage-point/auto-complete-textbox';
import { UseCaseError } from '@vantage-point/ddd-core';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { checkRoiModelValidity, determineActiveAccordionPanel } from '../accordion/actions';
import { setError } from '../errors/actions';
import { selectTenant } from '../tenant/selectors';
import { getUserProfile } from '../user/selectors';
import {
  clearAll,
  cloneRoiModel,
  createNewRoiModel,
  deleteRoiModel,
  loadModelFromDatastore,
  processCareerGoalForm,
  processCurrentInformationForm,
  processEducationCostForm,
  processEducationFinancingForm,
  requestMakeActive,
  saveModelErrorHappened,
  saveRoiModelToDataStore,
  updateRoiModel,
} from './actions';
import { getSelectedCareerGoal } from './selectors';



@Injectable()
export class RoiModelStoreEffects
{

  constructor
    (
      private store: Store,
      private actions$: Actions,
      private exchangeAutoCompleteForLocationGQL: ExchangeAutoCompleteForLocationGQL,
      private exchangeAutoCompleteForOccupationGQL: ExchangeAutoCompleteForOccupationGQL,
      private instructionalProgramGQL: InstructionalProgramGQL,
      private institutionByUnitIdGQL: InstitutionByUnitIdGQL,
      private roiModelService: RoiModelService,
      private lifetimeEarningsService: LifetimeEarningsService,
      private saveRoiModelGQL: SaveRoiModelGQL,
      private roiModelGQL: RoiModelGQL,
      private notificationService: NotificationService
    )
  {
  }


  loadModelFromDatastore$ = createEffect(() => this.actions$.pipe
    (
      ofType(loadModelFromDatastore),
      withLatestFrom
        (
          this.store.pipe(select(selectTenant)),
          this.store.pipe(select(getUserProfile))
        ),
      switchMap(([_, tenant, userProfile]) =>
      {
        return this.roiModelGQL
          .fetch(
            {
              tenantId: tenant.id,
              userId: userProfile.id
            }
          )
          .pipe
          (
            switchMap((results) =>
            {
              if (results.data.roiModel && results.data.roiModel.model)
              {
                const roiModelToSaveDto: RoiModelToSaveDto = results.data.roiModel.model;

                return this.roiModelService.fromSaveModelToAggregate(roiModelToSaveDto);
              }
              else
              {
                // THIS LOADS DEFAULT ROI AGGREGATE
                return this.roiModelService.getActiveRoiModel();
              }
            })
          );
      }),
      switchMap((roiModelDto: RoiModelDto) =>
        [
          updateRoiModel({ roiModelDto }),
          checkRoiModelValidity(),
          determineActiveAccordionPanel()
        ])
    ));

  createNewRoiModel$ = createEffect(() => this.actions$.pipe
    (
      ofType(createNewRoiModel),
      switchMap(() => this.roiModelService.createEmptyRoiModel(null)),
      switchMap((roiModelDto) => [updateRoiModel({ roiModelDto }), checkRoiModelValidity()])
    ));


  processCurrentInformationForm$ = createEffect(() => this.actions$.pipe
    (
      ofType(processCurrentInformationForm),
      switchMap((action) =>
      {
        const formData: CurrentInformationForm = action.currentInformationForm;
        const location: AutoCompleteModel = formData?.currentLocation;
        const occupation: AutoCompleteModel = formData?.currentOccupation;

        // console.log('EFFECTS | CAREER GOAL FORM DATA', formData);

        /*
        RETRIEVE LOCATION AND OCCUPATION FROM BACKEND....
        */
        return forkJoin
          (
            {
              location: (location) ? this.exchangeAutoCompleteForLocationGQL.fetch({ autoCompleteModel: location }) : of(null),
              occupation: (occupation) ? this.exchangeAutoCompleteForOccupationGQL.fetch({ autoCompleteModel: occupation }) : of(null)
            }
          )
          .pipe
          (
            switchMap((results) =>
            {
              // console.log('EFFECTS | RESULTS:', results);

              const currentInformation: CurrentInformationDto =
              {
                currentAge: formData.currentAge,
                occupation: (results.occupation) ? results.occupation.data.exchangeAutoCompleteForOccupation : null,
                location: (results.location) ? results.location.data.exchangeAutoCompleteForLocation : null,
                educationLevel: formData.educationLevel
              };

              return this.roiModelService.updateCurrentInformation(currentInformation);
            })
          );
      }),
      switchMap((roiModelDto: RoiModelDto) => [updateRoiModel({ roiModelDto }), checkRoiModelValidity()]),
      catchError((errorMessage) =>
      {
        const useCaseError: UseCaseError =
        {
          message: errorMessage,
          error: null,
          errorType: 'PROCESS CURRENT INFORMATION',
          details: null
        };

        return of(setError({ useCaseError }));
      })
    ));
  processCareerGoalForm$ = createEffect(() => this.actions$.pipe
    (
      ofType(processCareerGoalForm),
      withLatestFrom(this.store.pipe(select(getSelectedCareerGoal))),
      switchMap(([action, currentCareerGoal]) =>
      {
        const formData: CareerGoalForm = action.careerGoalForm;
        const location: AutoCompleteModel = formData?.location;
        const occupation: AutoCompleteModel = formData?.occupation;
        const cipCode: string = formData?.degreeProgram?.id;

        // console.log('EFFECTS | CAREER GOAL FORM DATA', formData);
        // console.log('EFFECTS | CURRENT CAREER GOAL', currentCareerGoal);

        const hasLocationChanged: boolean = (formData.location?.id !== currentCareerGoal.location?.zipCode);
        const hasOccupationChanged: boolean = (formData.occupation?.id !== currentCareerGoal.occupation?.onetCode);
        const hasProgramChanged: boolean = (formData.degreeProgram?.id !== currentCareerGoal.degreeProgram?.cipCode);

        // console.log('EFFECTS | hasLocationChanged', hasLocationChanged);
        // console.log('EFFECTS | hasOccupationChanged', hasOccupationChanged);
        // console.log('EFFECTS | hasProgramChanged', hasProgramChanged);

        /*
        RETRIEVE LOCATION AND OCCUPATION FROM BACKEND....
        */
        return forkJoin
          (
            {
              location: (location && hasLocationChanged) ? this.exchangeAutoCompleteForLocationGQL.fetch({ autoCompleteModel: location }) : of(null),
              occupation: (occupation && hasOccupationChanged) ? this.exchangeAutoCompleteForOccupationGQL.fetch({ autoCompleteModel: occupation }) : of(null),
              program: (cipCode && hasProgramChanged) ? this.instructionalProgramGQL.fetch({ cipCode: cipCode }) : of(null)
            }
          )
          .pipe
          (
            switchMap((results) =>
            {
              // console.log('RESULTS', results);

              const careerGoal: CareerGoalDto =
              {
                location: (results.location) ? results.location.data.exchangeAutoCompleteForLocation : (!hasLocationChanged) ? currentCareerGoal.location : null,
                occupation: (results.occupation) ? results.occupation.data.exchangeAutoCompleteForOccupation : (!hasOccupationChanged) ? currentCareerGoal.occupation : null,
                degreeLevel: formData.degreeLevel,
                degreeProgram: (results.program) ? results.program.data.instructionalProgram : (!hasProgramChanged) ? currentCareerGoal.degreeProgram : null,
                retirementAge: formData.retirementAge,
                careerGoalPathType: formData.careerGoalPathType
              };

              return this.roiModelService.updateCareerGoal(careerGoal);
            })
          );
      }),
      switchMap((roiModelDto: RoiModelDto) => [updateRoiModel({ roiModelDto }), checkRoiModelValidity()]),
      catchError((errorMessage) =>
      {
        const useCaseError: UseCaseError =
        {
          message: errorMessage,
          error: null,
          errorType: 'PROCESS CAREER GOAL',
          details: null
        };

        return of(setError({ useCaseError }));
      })
    ));
  processEducationCostForm$ = createEffect(() => this.actions$.pipe
    (
      ofType(processEducationCostForm),
      switchMap((action) =>
      {
        const formData: EducationCostForm = action.educationCostForm;
        const institutionId: string = formData?.institution?.id;

        /*
        RETRIEVE INSTITUTION FROM BACKEND....
        */
        return forkJoin
          (
            {
              institution: (institutionId) ? this.institutionByUnitIdGQL.fetch({ unitId: institutionId }) : of(null),
            }
          )
          .pipe
          (
            switchMap((results) =>
            {
              const educationCost: EducationCostDto =
              {
                institution: (results.institution) ? results.institution.data.institution : null,
                startYear: formData.startYear,
                incomeRange: formData.incomeRange,
                isFulltime: formData.isFulltime,
                yearsToCompleteDegree: formData.yearsToCompleteDegree
              };

              return this.roiModelService.updateEducationCost(educationCost);
            })
          );
      }),
      switchMap((roiModelDto: RoiModelDto) => [updateRoiModel({ roiModelDto }), checkRoiModelValidity()]),
      catchError((errorMessage) =>
      {
        const useCaseError: UseCaseError =
        {
          message: errorMessage,
          error: null,
          errorType: 'PROCESS EDUCATION COST',
          details: null
        };

        return of(setError({ useCaseError }));
      })
    ));
  processEducationFinancingForm$ = createEffect(() => this.actions$.pipe
    (
      ofType(processEducationFinancingForm),
      switchMap((action) => this.roiModelService.updateEducationFinancing(action.educationFinancingForm)),
      switchMap((roiModelDto: RoiModelDto) => [updateRoiModel({ roiModelDto }), checkRoiModelValidity()]),
      catchError((errorMessage) =>
      {
        const useCaseError: UseCaseError =
        {
          message: errorMessage,
          error: null,
          errorType: 'PROCESS EDUCATION FINANCING',
          details: null
        };

        return of(setError({ useCaseError }));
      })
    ));

  saveRoiModelToDataStore$ = createEffect(() => this.actions$.pipe
    (
      ofType(saveRoiModelToDataStore, updateRoiModel),
      switchMap(() => this.roiModelService.fromAggregateToSaveModel()),
      withLatestFrom
        (
          this.store.pipe(select(selectTenant)),
          this.store.pipe(select(getUserProfile))
        ),
      switchMap(([roiModelToSaveDto, tenant, userProfile]) =>
      {
        const roiModelInput: RoiModelInput =
        {
          tenantId: tenant.id,
          userId: userProfile.id,
          roiAggregateId: roiModelToSaveDto.roiAggregateId,
          model: JSON.stringify(roiModelToSaveDto)
        };

        return this.saveRoiModelGQL
          .mutate({ roiModelInput: roiModelInput })
          .pipe
          (
            map((_results) =>
            {
              // console.log('results from saving to datastore:', _results);
              // return NoopAction();
            })
          );
      }),
      catchError((errorMessage) =>
      {
        const useCaseError: UseCaseError =
        {
          message: errorMessage,
          error: null,
          errorType: 'SAVE ROI MODEL',
          details: null
        };

        return of(saveModelErrorHappened({ useCaseError }));
      })
    ), { dispatch: false });



  cloneRoiModel$ = createEffect(() => this.actions$.pipe
    (
      ofType(cloneRoiModel),
      switchMap((action) => this.roiModelService.cloneRoiModel(action.dialogDataToKeepModel)),
      switchMap((roiModelDto: RoiModelDto) =>
        [
          updateRoiModel({ roiModelDto }),
          checkRoiModelValidity(),
          determineActiveAccordionPanel()
        ])
    ));

  deleteRoiModel$ = createEffect(() => this.actions$.pipe
    (
      ofType(deleteRoiModel),
      switchMap((action) => this.roiModelService.deleteRoiModel(action.roiModelDto)),
      switchMap((roiModelDto: RoiModelDto) =>
        [
          updateRoiModel({ roiModelDto }),
          checkRoiModelValidity(),
          determineActiveAccordionPanel()
        ])
    ));

  clearAll$ = createEffect(() => this.actions$.pipe
    (
      ofType(clearAll),
      switchMap(() => this.roiModelService.clear()),
      switchMap((roiModelDto: RoiModelDto) =>
      {
        this.lifetimeEarningsService.clear();

        return [
          updateRoiModel({ roiModelDto }),
          checkRoiModelValidity(),
          determineActiveAccordionPanel()
        ];
      })
    ));

  requestMakeActive$ = createEffect(() => this.actions$.pipe
    (
      ofType(requestMakeActive),
      switchMap((action) => this.roiModelService.makeActive(action.roiModelDto)),
      switchMap((roiModelDto: RoiModelDto) =>
      {
        this.lifetimeEarningsService.loadGraph(roiModelDto);

        return [
          updateRoiModel({ roiModelDto }),
          checkRoiModelValidity(),
          determineActiveAccordionPanel()
        ];
      })
    ));



  saveModelErrorHappened$ = createEffect(() => this.actions$.pipe
    (
      ofType(saveModelErrorHappened),
      switchMap((action) => this.notificationService.error(action.useCaseError).afterDismissed())
    ), { dispatch: false });

}
