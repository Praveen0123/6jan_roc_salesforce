import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompareFacadeService } from '@app/+state/compare/facade.service';
import { OffCanvasFacadeService } from '@app/+state/off-canvas';
import { RoiModelFacadeService } from '@app/+state/roi-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'roc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit
{
  @Input() isOffCanvasOpen: boolean;
  @Output('onShowSaved') showSavedEventEmitter = new EventEmitter<boolean>();

  compareCount$: Observable<number>;
  roiModelCount$: Observable<number>;

  constructor
    (
      private compareFacadeService: CompareFacadeService,
      private roiModelFacadeService: RoiModelFacadeService,
      private offCanvasFacadeService: OffCanvasFacadeService
    ) { }

  ngOnInit(): void
  {
    this.compareCount$ = this.compareFacadeService.getCompareCount$();
    this.roiModelCount$ = this.roiModelFacadeService.getRoiModelCount$();
  }

  onShowSaved()
  {
    if (this.showSavedEventEmitter.observers.length > 0)
    {
      this.showSavedEventEmitter.emit(!this.isOffCanvasOpen);
    }
  }

  closeOffCanvasMenu()
  {
    this.offCanvasFacadeService.setOffCanvasClosed();
  }

}
