import { Injectable } from '@angular/core';
import { CareerGoalForm, CurrentInformationForm, EducationCostForm } from '@app/core/models';
import { DialogDataToKeepModel, EducationFinancingDto, RoiModelDto, RoiModelService } from '@app/domain';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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
  saveRoiModelToDataStore,
} from './actions';
import { getSelectedRoiModel, getSelectedRoiModelId } from './selectors';


@Injectable({
  providedIn: 'root'
})
export class RoiModelFacadeService
{

  constructor
    (
      private store: Store,
      private roiModelService: RoiModelService
    )
  {
  }


  loadModelFromDatastore()
  {
    return this.store.dispatch(loadModelFromDatastore());
  }

  createNewRoiModel()
  {
    return this.store.dispatch(createNewRoiModel());
  }

  saveRoiModelToDataStore()
  {
    return this.store.dispatch(saveRoiModelToDataStore());
  }




  cloneRoiModel(dialogDataToKeepModel: DialogDataToKeepModel)
  {
    return this.store.dispatch(cloneRoiModel({ dialogDataToKeepModel }));
  }


  deleteRoiModel(roiModelDto: RoiModelDto)
  {
    return this.store.dispatch(deleteRoiModel({ roiModelDto }));
  }

  requestMakeActive(roiModelDto: RoiModelDto)
  {
    return this.store.dispatch(requestMakeActive({ roiModelDto }));
  }


  getRoiModelList$(): Observable<RoiModelDto[]>
  {
    return this.roiModelService.roiModelList$;
  }
  getRoiModelCount$(): Observable<number>
  {
    return this.roiModelService.roiModelCount$;
  }
  getSelectedRoiModel$(): Observable<RoiModelDto>
  {
    return this.store.pipe(select(getSelectedRoiModel));
  }
  getSelectedRoiModelId$(): Observable<string>
  {
    return this.store.pipe(select(getSelectedRoiModelId));
  }


  processCurrentInformationForm(currentInformationForm: CurrentInformationForm): void
  {
    this.store.dispatch(processCurrentInformationForm({ currentInformationForm }));
  }
  processCareerGoalForm(careerGoalForm: CareerGoalForm): void
  {
    this.store.dispatch(processCareerGoalForm({ careerGoalForm }));
  }
  processEducationCostForm(educationCostForm: EducationCostForm): void
  {
    this.store.dispatch(processEducationCostForm({ educationCostForm }));
  }
  processEducationFinancingForm(educationFinancingForm: EducationFinancingDto): void
  {
    this.store.dispatch(processEducationFinancingForm({ educationFinancingForm }));
  }


  clearAll()
  {
    return this.store.dispatch(clearAll());
  }
}
