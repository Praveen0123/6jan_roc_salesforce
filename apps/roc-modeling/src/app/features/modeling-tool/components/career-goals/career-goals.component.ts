import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CareerGoalForm } from '@app/core/models';
import { RoiModelDto } from '@app/domain';


@Component({
  selector: 'roc-career-goals',
  templateUrl: './career-goals.component.html',
  styleUrls: ['./career-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareerGoalsComponent implements OnInit
{
  @Input() roiModelDto: RoiModelDto;
  @Output('onCareerGoalSubmitted') careerGoalEventEmitter = new EventEmitter<CareerGoalForm>();

  selectedTabIndex: number;

  constructor() { }

  ngOnInit(): void
  {
    this.selectedTabIndex = this.roiModelDto.careerGoal.careerGoalPathType;
  }

  onExploreCareersSubmitted(careerGoalForm: CareerGoalForm)
  {
    this.emitCareerGoal(careerGoalForm);
  }

  onExploreDegreesSubmitted(careerGoalForm: CareerGoalForm)
  {
    this.emitCareerGoal(careerGoalForm);
  }

  private emitCareerGoal(careerGoalForm: CareerGoalForm)
  {
    if (this.careerGoalEventEmitter.observers.length > 0)
    {
      this.careerGoalEventEmitter.emit(careerGoalForm);
    }
  }
}
