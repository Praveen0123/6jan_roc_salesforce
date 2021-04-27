import { CareerGoalDto, EducationCostDto, RoiModelDto } from '@app/domain';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { ROI_MODEL_STORE_FEATURE_KEY, RoiModelStoreState } from './state';


// RETRIEVE SLICE OF STATE
export const roiModelStoreSlice: MemoizedSelector<object, RoiModelStoreState> = createFeatureSelector<RoiModelStoreState>(ROI_MODEL_STORE_FEATURE_KEY);


export const getSelectedRoiModel: MemoizedSelector<object, RoiModelDto> = createSelector
  (
    roiModelStoreSlice,
    (state): RoiModelDto => state.activeRoiModel
  );

export const getSelectedRoiModelId: MemoizedSelector<object, string> = createSelector
  (
    roiModelStoreSlice,
    (state): string => state.activeRoiModel?.roiModelId ?? ''
  );

export const getSelectedCareerGoal: MemoizedSelector<object, CareerGoalDto> = createSelector
  (
    getSelectedRoiModel,
    (roiModelDto): CareerGoalDto =>
    {
      return roiModelDto?.careerGoal ?? null;
    }
  );

export const getSelectedEducationCost: MemoizedSelector<object, EducationCostDto> = createSelector
  (
    getSelectedRoiModel,
    (roiModelDto): EducationCostDto =>
    {
      return roiModelDto?.educationCost ?? null;
    }
  );
