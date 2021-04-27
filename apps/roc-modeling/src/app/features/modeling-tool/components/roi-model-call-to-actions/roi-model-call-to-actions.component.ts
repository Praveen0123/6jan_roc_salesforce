import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { DialogDataToKeepModel, RoiModelDto } from '@app/domain';
import { DialogCloneModelComponent } from '@app/shared/components/dialog-clone-model/dialog-clone-model.component';
import { map, takeWhile } from 'rxjs/operators';



@Component({
  selector: 'roc-roi-model-call-to-actions',
  templateUrl: './roi-model-call-to-actions.component.html',
  styleUrls: ['./roi-model-call-to-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoiModelCallToActionsComponent implements OnInit, OnDestroy, OnChanges
{
  private alive: boolean = true;

  @Input() roiModelDto: RoiModelDto;

  @Output('onClone') cloneEventEmitter = new EventEmitter<DialogDataToKeepModel>();
  @Output('onShare') shareEventEmitter = new EventEmitter<RoiModelDto>();

  roiAggregateDtoAsString: string;

  constructor
    (
      private dialog: MatDialog,
      private notificationService: NotificationService
    ) { }

  ngOnInit(): void
  {
    this.roiAggregateDtoToString();
  }

  ngOnDestroy(): void
  {
    this.alive = false;
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.roiModelDto && !changes.roiModelDto.firstChange)
    {
      this.roiAggregateDtoToString();
    }
  }

  onCloneClick()
  {
    const dialogRef = this.dialog.open(DialogCloneModelComponent,
      {
        data: this.roiModelDto
      });

    dialogRef.afterClosed()
      .pipe
      (
        takeWhile(() => this.alive),
        map((result: DialogDataToKeepModel) =>
        {
          if (result && this.cloneEventEmitter.observers.length > 0)
          {
            this.cloneEventEmitter.emit(result);
          }
        })
      ).subscribe();
  }

  onShareClick()
  {
    if (this.shareEventEmitter.observers.length > 0)
    {
      this.shareEventEmitter.emit(this.roiModelDto);
    }
  }

  onCopyModelSuccess()
  {
    this.notificationService.success('Successfully copied model');
  }

  private roiAggregateDtoToString()
  {
    this.roiAggregateDtoAsString = JSON.stringify(this.roiModelDto);
  }
}
