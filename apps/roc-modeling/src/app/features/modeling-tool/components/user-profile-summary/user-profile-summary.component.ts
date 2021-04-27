import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RoiModelDto } from '@app/domain';
import { Location } from '@gql';

@Component({
  selector: 'roc-user-profile-summary',
  templateUrl: './user-profile-summary.component.html',
  styleUrls: ['./user-profile-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileSummaryComponent implements OnInit, OnChanges
{
  @Input() roiModelDto: RoiModelDto;

  defaultName: string = 'N/A';
  careerName: string;
  degreeName: string;
  schoolName: string;
  locationName: string;

  constructor() { }

  ngOnInit(): void
  {
    this.initializeNames();
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.roiModelDto && !changes.roiModelDto.firstChange)
    {
      this.initializeNames();
    }
  }

  private initializeNames(): void
  {
    this.careerName = this.roiModelDto?.careerGoal?.occupation?.title ?? this.defaultName;
    this.degreeName = this.roiModelDto?.careerGoal?.degreeProgram?.cipTitle ?? this.defaultName;
    this.schoolName = this.roiModelDto?.educationCost?.institution?.name ?? this.defaultName;
    this.locationName = this.getLocationName();

    // console.log(this.careerName);
    // console.log(this.degreeName);
    // console.log(this.schoolName);
    // console.log(this.locationName);
  }

  private getLocationName(): string
  {
    const location: Location = this.roiModelDto?.careerGoal?.location;

    if (location)
    {
      return `${location.cityName}, ${location.stateAbbreviation}`;
    }

    return this.defaultName;
  }
}
