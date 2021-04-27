import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CompareFacadeService } from '@app/+state/compare/facade.service';
import { CompareModel } from '@app/+state/compare/state';
import { OffCanvasFacadeService } from '@app/+state/off-canvas';
import { Observable } from 'rxjs';

@Component({
  selector: 'roc-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompareComponent implements OnInit
{
  compareModelList$: Observable<CompareModel[]>;

  constructor
    (
      private compareFacadeService: CompareFacadeService,
      private offCanvasFacadeService: OffCanvasFacadeService
    ) { }

  ngOnInit(): void
  {
    this.compareModelList$ = this.compareFacadeService.getCompareList$();
  }

  onViewSavedModels()
  {
    this.offCanvasFacadeService.setOffCanvasOpen();
  }

}
