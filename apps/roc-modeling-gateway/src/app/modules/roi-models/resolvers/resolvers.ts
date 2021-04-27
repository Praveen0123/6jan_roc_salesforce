import { ModuleContext } from '@graphql-modules/core';
import { RoiModel } from '@roc-modeling-gateway-models';

import { RoiModelListInput, RoiModelListUseCase } from '../use-cases/roi-model-list';
import { SaveRoiModelUseCase } from '../use-cases/save-roi-model';
import { ShareRoiModelUseCase } from '../use-cases/share-roi-model';


export default
  {
    Query:
    {
      roiModel: async (_root: any, args: any, { injector }: ModuleContext): Promise<RoiModel[]> =>
      {
        const roiModelListInput: RoiModelListInput =
        {
          tenantId: args.tenantId,
          userId: args.userId
        };

        return await injector.get(RoiModelListUseCase).executeAsync(roiModelListInput);
      }
    },
    Mutation:
    {
      saveRoiModel: async (_root: any, args: any, { injector }: ModuleContext): Promise<RoiModel> =>
      {
        return await injector.get(SaveRoiModelUseCase).executeAsync(args.roiModelInput);
      },
      shareRoiModel: async (_root: any, args: any, { injector }: ModuleContext): Promise<RoiModel> =>
      {
        return await injector.get(ShareRoiModelUseCase).executeAsync(args.shareRoiModelInput);
      }
    },
  };
