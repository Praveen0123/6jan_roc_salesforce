import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompareFacadeService } from '@app/+state/compare';
import { OffCanvasFacadeService } from '@app/+state/off-canvas';
import { RoiModelFacadeService } from '@app/+state/roi-model';
import { UserFacadeService } from '@app/+state/user';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { RoiModelDto, RoiModelService } from '@app/domain';
import { DialogConfirmationComponent } from '@app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { UserProfile } from '@gql';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'roc-off-canvas-saved-models',
  templateUrl: './off-canvas-saved-models.component.html',
  styleUrls: ['./off-canvas-saved-models.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffCanvasSavedModelsComponent implements OnInit, OnDestroy
{
  alive: boolean = true;

  roiModelList$: Observable<RoiModelDto[]>;
  compareIdList$: Observable<string[] | number[]>;
  selectedRoiModelId$: Observable<string>;

  userProfile: UserProfile;

  constructor
    (
      private compareFacadeService: CompareFacadeService,
      private offCanvasFacadeService: OffCanvasFacadeService,
      private roiModelFacadeService: RoiModelFacadeService,
      private roiModelService: RoiModelService,
      private notificationService: NotificationService,
      private userFacadeService: UserFacadeService,
      private dialog: MatDialog,
      private clipboard: Clipboard
    ) { }

  ngOnInit(): void
  {
    this.roiModelList$ = this.roiModelFacadeService.getRoiModelList$();
    this.compareIdList$ = this.compareFacadeService.getCompareIdList$();
    this.selectedRoiModelId$ = this.roiModelFacadeService.getSelectedRoiModelId$();

    this.userFacadeService.getUserProfile$()
      .pipe
      (
        takeWhile(() => this.alive),
        map((userProfile: UserProfile) =>
        {
          this.userProfile = userProfile;
        })
      ).subscribe();
  }

  ngOnDestroy()
  {
    this.alive = false;
  }

  onAddNewModel()
  {
    this.roiModelFacadeService.createNewRoiModel();
  }

  onClose()
  {
    this.offCanvasFacadeService.setOffCanvasClosed();
  }

  onMakeActive(roiModelDto: RoiModelDto)
  {
    this.roiModelFacadeService.requestMakeActive(roiModelDto);
    this.offCanvasFacadeService.setOffCanvasClosed();
  }

  onCompare(isCompare: boolean, roiModelDto: RoiModelDto)
  {
    if (isCompare)
    {
      this.compareFacadeService.addToCompare(roiModelDto);
    }
    else
    {
      this.compareFacadeService.removeRoiAggregateFromCompare(roiModelDto);
    }
  }

  onDelete(roiModelDto: RoiModelDto)
  {
    const message = `Are you sure you want to delete ${roiModelDto.name} model?`;

    const dialogRef = this.dialog.open(DialogConfirmationComponent,
      {
        data: { message: message },
        disableClose: true
      });

    dialogRef
      .afterClosed()
      .pipe
      (
        takeWhile(() => this.alive),
        map((isConfirmed: boolean) =>
        {
          if (isConfirmed)
          {
            this.roiModelFacadeService.deleteRoiModel(roiModelDto);
          }
        })
      )
      .subscribe();

  }

  onCopyRoiAggregateModel()
  {
    const results =
    {
      userProfile: this.userProfile,
      roiSummary: this.roiModelService.roiAggregate
    };

    const pending = this.clipboard.beginCopy(JSON.stringify(results));
    let remainingAttempts = 3;

    const attempt = () =>
    {
      const pendingCopy = pending.copy();

      if (!pendingCopy && --remainingAttempts)
      {
        setTimeout(attempt);
      }
      else
      {
        this.notificationService.success('copy successful');
        // Remember to destroy when you're done!
        pending.destroy();
      }
    };
    attempt();
  }

}
