import { IMapper, Result, UniqueEntityID } from '@vantage-point/ddd-core';
import hash from 'object-hash';

import { CareerGoal, CurrentInformation, EducationCost, EducationFinancing, RoiModel } from '../domain';
import { RoiAggregate } from '../domain/roi.aggregate';
import { CareerGoalDto, CurrentInformationDto, EducationCostDto, EducationFinancingDto, RoiModelDto, RoiModelToSaveDto } from '../dtos';
import { CareerGoalMapper } from './career-goal.mapper';
import { CurrentInformationMapper } from './current-information.mapper';
import { EducationCostMapper } from './education-cost.mapper';
import { EducationFinancingMapper } from './education-financing.mapper';


export class RoiModelAggregateMapper implements IMapper<RoiAggregate, RoiModelDto>
{

  private constructor()
  {
  }

  public static create(): RoiModelAggregateMapper
  {
    return new RoiModelAggregateMapper();
  }


  toDTO(input: RoiAggregate): RoiModelDto
  {
    return this.toRoiModelDto(input, input.activeRoiModel);
  }

  toSaveDTO(input: RoiAggregate): RoiModelToSaveDto
  {
    const roiModelList: RoiModelDto[] = this.toDTOList(input);
    const currentInformationDto: CurrentInformationDto = (input.currentInformation) ? CurrentInformationMapper.create().toDTO(input.currentInformation) : null;

    const roiModelToSaveDto: RoiModelToSaveDto =
    {
      roiAggregateId: input.roiAggregateId,
      activeRoiModelId: input.activeRoiModel.roiModelId.id.toString(),
      currentInformation: currentInformationDto,
      roiModelList: roiModelList
    };

    return roiModelToSaveDto;
  }

  toDTOList(input: RoiAggregate): RoiModelDto[]
  {
    const list: RoiModelDto[] = [];

    input.roiModelList.map((item: RoiModel) =>
    {
      const roiModelDto: RoiModelDto = this.toRoiModelDto(input, item);
      list.push(roiModelDto);
    });

    return list;
  }

  toDomain(input: RoiModelDto): Result<RoiAggregate>
  {
    const currentInformationOrError: Result<CurrentInformation> = CurrentInformationMapper.create().toDomain(input.currentInformation);
    const roiModelOrError: Result<RoiModel> = this.toRoiModel(input);

    if (currentInformationOrError.isSuccess && roiModelOrError.isSuccess)
    {
      const currentInformation: CurrentInformation = currentInformationOrError.getValue();
      const roiModel: RoiModel = roiModelOrError.getValue();

      return RoiAggregate.create
        (
          {
            currentInformation: currentInformation,
            roiModel: roiModel
          },
          UniqueEntityID.create(input.roiAggregateId)
        );
    }

    if (currentInformationOrError.isFailure)
    {
      throw currentInformationOrError.getError();
    }

    if (roiModelOrError.isFailure)
    {
      throw roiModelOrError.getError();
    }
  }

  toDomainFromSavedModel(roiModelToSaveDto: RoiModelToSaveDto): Result<RoiAggregate>
  {
    const currentInformationOrError: Result<CurrentInformation> = CurrentInformationMapper.create().toDomain(roiModelToSaveDto.currentInformation);

    if (currentInformationOrError.isSuccess)
    {
      const roiAggregateOrError: Result<RoiAggregate> = RoiAggregate.create
        (
          { currentInformation: currentInformationOrError.getValue() },
          UniqueEntityID.create(roiModelToSaveDto.roiAggregateId)
        );

      if (roiAggregateOrError.isSuccess)
      {
        const roiAggregate: RoiAggregate = roiAggregateOrError.getValue();

        const list: RoiModel[] = [];

        roiModelToSaveDto.roiModelList.map((item: RoiModelDto) =>
        {
          const roiModelOrError: Result<RoiModel> = this.toRoiModel(item);

          if (roiModelOrError.isSuccess)
          {
            list.push(roiModelOrError.getValue());
          }
        });

        roiAggregate.loadRoiModelList(list);

        roiAggregate.makeActive(roiModelToSaveDto.activeRoiModelId);

        return Result.success<RoiAggregate>(roiAggregate);
      }

      throw roiAggregateOrError.getError();
    }

    if (currentInformationOrError.isFailure)
    {
      throw currentInformationOrError.getError();
    }
  }


  private toRoiModelDto(input: RoiAggregate, roiModel: RoiModel): RoiModelDto
  {
    const currentInformationDto: CurrentInformationDto = (input.currentInformation) ? CurrentInformationMapper.create().toDTO(input.currentInformation) : null;
    const careerGoal: CareerGoalDto = (roiModel.careerGoal) ? CareerGoalMapper.create().toDTO(roiModel.careerGoal) : null;
    const educationCost: EducationCostDto = (roiModel.educationCost) ? EducationCostMapper.create().toDTO(roiModel.educationCost) : null;
    const educationFinancing: EducationFinancingDto = (roiModel.educationFinancing) ? EducationFinancingMapper.create().toDTO(roiModel.educationFinancing) : null;

    const isCurrentInformationDefault: boolean = (hash(CurrentInformation.defaultProps) === hash(input.currentInformation?.props));
    const isCareerGoalDefault: boolean = (hash(CareerGoal.defaultProps) === hash(roiModel.careerGoal?.props));
    const isEducationCostDefault: boolean = (hash(EducationCost.defaultProps) === hash(roiModel.educationCost?.props));
    const isEducationFinancingDefault: boolean = (hash(EducationFinancing.defaultProps) === hash(roiModel.educationFinancing?.props));

    const loanLimitsInfo = roiModel.getLoanLimitsInfo();

    const roiModelDto: RoiModelDto =
    {
      roiModelId: roiModel.roiModelId.id.toString(),
      roiAggregateId: input.roiAggregateId,
      name: roiModel.name,
      currentInformation: currentInformationDto,

      careerGoal: careerGoal,
      educationCost: educationCost,
      educationCostRefinement: null,
      educationFinancing: educationFinancing,
      roiCalculatorInput: roiModel.roiCalculatorInput,
      roiCalculatorInputHash: roiModel.hash,
      roiCalculatorOutput: roiModel.roiCalculatorOutput,
      radiusInMiles: roiModel.radiusInMiles,
      dateCreated: roiModel.dateCreated,
      lastUpdated: roiModel.lastUpdated,

      costOfAttendanceByYear: roiModel.getCostOfAttendanceByYear(input.currentInformation),
      grantOrScholarshipAidExcludingPellGrant: roiModel.getGrantOrScholarshipAidExcludingPellGrant(),
      efc: roiModel.getEfc(),
      netPriceByYear: roiModel.getNetPriceByYear(input.currentInformation),
      federalSubsidizedLoanLimitByYear: loanLimitsInfo.federalSubsidizedLoanByYear,
      federalUnsubsidizedLoanLimitByYear: loanLimitsInfo.federalUnsubsidizedLoanByYear,
      outOfPocketExpensesByYear: roiModel.getOutOfPocketExpensesByYear(input.currentInformation),

      isDefaultModel: (isCurrentInformationDefault && isCareerGoalDefault && isEducationCostDefault && isEducationFinancingDefault),
      isReadyForCompare: false
    };

    return roiModelDto;

  }

  private toRoiModel(input: RoiModelDto): Result<RoiModel>
  {
    const careerGoalOrError: Result<CareerGoal> = CareerGoalMapper.create().toDomain(input.careerGoal);
    const educationCostOrError: Result<EducationCost> = EducationCostMapper.create().toDomain(input.educationCost);
    const educationFinancingOrError: Result<EducationFinancing> = EducationFinancingMapper.create().toDomain(input.educationFinancing);

    const roiModelOrError: Result<RoiModel> = RoiModel.create
      (
        {
          name: input.name,
          careerGoal: careerGoalOrError.isSuccess ? careerGoalOrError.getValue() : null,
          educationCost: educationCostOrError.isSuccess ? educationCostOrError.getValue() : null,
          educationCostRefinement: null,
          educationFinancing: educationFinancingOrError.isSuccess ? educationFinancingOrError.getValue() : null,
          radiusInMiles: input?.radiusInMiles ?? null,
          dateCreated: input.dateCreated ?? null,
          lastUpdated: input.lastUpdated ?? null
        },
        UniqueEntityID.create(input.roiModelId)
      );

    return roiModelOrError;
  }
}
