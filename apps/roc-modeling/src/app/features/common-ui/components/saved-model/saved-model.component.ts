import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CompareService } from '@app/+state/compare/compare.service';
import { RoiModelDto } from '@app/domain';

@Component({
  selector: 'roc-saved-model',
  templateUrl: './saved-model.component.html',
  styleUrls: ['./saved-model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavedModelComponent implements OnInit, OnChanges
{
  @Input() roiModelDto: RoiModelDto;
  @Input() compareIdList: string[];
  @Output('onMakeActive') makeActiveEventEmitter = new EventEmitter<RoiModelDto>();
  @Output('onCompare') compareClickEventEmitter = new EventEmitter<boolean>();
  @Output('onDelete') deleteEventEmitter = new EventEmitter<RoiModelDto>();

  isInCompare: boolean;
  isReadyForCompare: boolean;

  constructor
    (
      private compareService: CompareService
    ) { }

  ngOnInit(): void
  {
    this.checkIsInCompare();
    this.checkIsReadyForCompare();
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.compareIdList && !changes.compareIdList.firstChange)
    {
      this.checkIsInCompare();
    }
    if (changes.roiModelDto && !changes.roiModelDto.firstChange)
    {
      this.checkIsReadyForCompare();
    }
  }

  onMakeActiveClick()
  {
    if (this.makeActiveEventEmitter.observers.length > 0)
    {
      this.makeActiveEventEmitter.emit(this.roiModelDto);
    }
  }

  onCompare(isCompare: boolean)
  {
    if (this.compareClickEventEmitter.observers.length > 0)
    {
      this.compareClickEventEmitter.emit(isCompare);
    }
  }

  onDelete()
  {
    if (this.deleteEventEmitter.observers.length > 0)
    {
      this.deleteEventEmitter.emit(this.roiModelDto);
    }
  }


  private checkIsInCompare(): void
  {
    this.isInCompare = (this.compareIdList.filter((item: string) => item === this.roiModelDto.roiModelId).length > 0);
  }


  private checkIsReadyForCompare(): void
  {
    this.isReadyForCompare = this.compareService.isReadyForCompare(this.roiModelDto);
  }

}
