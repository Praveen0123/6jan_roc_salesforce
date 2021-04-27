import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RoiModelFacadeService } from '@app/+state/roi-model';


@Injectable({
  providedIn: 'root'
})
export class ModelInitializationService implements Resolve<void>
{
  constructor
    (
      private roiModelFacadeService: RoiModelFacadeService
    ) { }

  resolve()
  {
    this.roiModelFacadeService.loadModelFromDatastore();
  }
}
