import { CareerGoalForm, CurrentInformationForm, EducationCostForm } from '@app/core/models';
import { DialogDataToKeepModel, EducationFinancingDto, RoiModelDto } from '@app/domain';
import { createAction, props } from '@ngrx/store';
import { UseCaseError } from '@vantage-point/ddd-core';




export const loadModelFromDatastore = createAction
  (
    '[RoiModel] load model from store'
  );

export const createNewRoiModel = createAction
  (
    '[RoiModel] create new roiModel'
  );

export const saveRoiModelToDataStore = createAction
  (
    '[RoiModel] save roi model to datastore'
  );

export const clearAll = createAction
  (
    '[RoiModel] clear all'
  );



export const processCurrentInformationForm = createAction
  (
    '[RoiModel] process currentt information form',
    props<{ currentInformationForm: CurrentInformationForm; }>()
  );
export const processCareerGoalForm = createAction
  (
    '[RoiModel] process career goal form',
    props<{ careerGoalForm: CareerGoalForm; }>()
  );
export const processEducationCostForm = createAction
  (
    '[RoiModel] process education cost form',
    props<{ educationCostForm: EducationCostForm; }>()
  );
export const processEducationFinancingForm = createAction
  (
    '[RoiModel] process education financing form',
    props<{ educationFinancingForm: EducationFinancingDto; }>()
  );

export const updateRoiModel = createAction
  (
    '[RoiModel] update roi model',
    props<{ roiModelDto: RoiModelDto; }>()
  );

export const deleteRoiModel = createAction
  (
    '[RoiModel] remove roi model',
    props<{ roiModelDto: RoiModelDto; }>()
  );


export const requestMakeActive = createAction
  (
    '[RoiModel] make active',
    props<{ roiModelDto: RoiModelDto; }>()
  );
export const NoopAction = createAction
  (
    '[RoiModel] NoopAction'
  );





export const cloneRoiModel = createAction
  (
    '[RoiModel] clone roi model',
    props<{ dialogDataToKeepModel: DialogDataToKeepModel; }>()
  );

export const saveModelErrorHappened = createAction
  (
    '[RoiModel] save model error happened',
    props<{ useCaseError: UseCaseError; }>()
  );
