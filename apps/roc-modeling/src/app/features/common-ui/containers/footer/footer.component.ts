import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserFacadeService } from '@app/+state/user';
import { NavigationService } from '@app/core/services';
import { FeedbackFormComponent } from '../../components/feedback-form/feedback-form.component';

@Component({
  selector: 'roc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit
{

  constructor
    (
      private userFacadeService: UserFacadeService,
      private navigationService: NavigationService, public dialog: MatDialog
    ) { }

  ngOnInit(): void
  {
  }

  onLogout()
  {
    this.userFacadeService.requestLogout();
  }

  onAbout()
  {
    this.navigationService.goToAboutPage();
  }

  openDialogFeedbackForm(): void
  {
    const dialogRef = this.dialog.open(FeedbackFormComponent, {

      height: '692px',
      width: '666px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) =>
    {
      console.log('School finder Dialog Close', result);
    });
  }
}
