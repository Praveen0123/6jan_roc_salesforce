import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AccordionFacadeService } from '@app/+state/accordion/facade.service';
import { AccordionPanelEnum, AccordionState } from '@app/+state/accordion/state';
import { CompareFacadeService } from '@app/+state/compare';
import { RoiModelFacadeService } from '@app/+state/roi-model';
import { CareerGoalForm, CurrentInformationForm, EducationCostForm } from '@app/core/models';
import { NavigationService } from '@app/core/services';
import { DialogDataToKeepModel, EducationFinancingDto, RoiModelDto } from '@app/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'roc-modeling-tool',
  templateUrl: './modeling-tool.component.html',
  styleUrls: ['./modeling-tool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelingToolComponent implements OnInit
{
  roiModelDto$: Observable<RoiModelDto>;
  accordionState$: Observable<AccordionState>;

  constructor
    (
      private roiModelFacadeService: RoiModelFacadeService,
      private accordionFacadeService: AccordionFacadeService,
      private compareFacadeService: CompareFacadeService,
      private navigationService: NavigationService
    ) { }

  ngOnInit(): void
  {
    this.roiModelDto$ = this.roiModelFacadeService.getSelectedRoiModel$();
    this.accordionState$ = this.accordionFacadeService.getSelectedAccordionModel$();
  }

  onCurrentInformationSubmitted(currentInformationForm: CurrentInformationForm)
  {
    this.roiModelFacadeService.processCurrentInformationForm(currentInformationForm);
  }

  onCareerGoalSubmitted(careerGoalForm: CareerGoalForm)
  {
    this.roiModelFacadeService.processCareerGoalForm(careerGoalForm);
  }

  onEducationCostSubmitted(educationCostForm: EducationCostForm)
  {
    this.roiModelFacadeService.processEducationCostForm(educationCostForm);
  }

  onEducationFinancingSubmitted(educationFinancing: EducationFinancingDto)
  {
    this.roiModelFacadeService.processEducationFinancingForm(educationFinancing);
  }

  onResetAll()
  {
    this.roiModelFacadeService.clearAll();
    this.accordionFacadeService.resetAccordion();
    this.compareFacadeService.clearAll();
  }

  onPanelChange(accordionPanelEnum: AccordionPanelEnum)
  {
    this.accordionFacadeService.setActivePanel(accordionPanelEnum);
  }

  onClone(dialogDataToKeepModel: DialogDataToKeepModel)
  {
    this.roiModelFacadeService.cloneRoiModel(dialogDataToKeepModel);
  }

  onShare(roiModelDto: RoiModelDto)
  {
    console.log('SHARE MODEL', roiModelDto);
    this.navigationService.goToShareModelPage();
  }

}
