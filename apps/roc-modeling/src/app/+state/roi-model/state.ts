import { RoiModelDto } from '@app/domain';


export const ROI_MODEL_STORE_FEATURE_KEY = 'roi-model-store';

export interface RoiModelStoreState
{
  activeRoiModel: RoiModelDto;
}

export const initialRoiModelStoreState: RoiModelStoreState =
{
  activeRoiModel: null
};
