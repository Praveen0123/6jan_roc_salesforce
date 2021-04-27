import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserFacadeService } from '@app/+state/user';

@Component({
  selector: 'roc-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent implements OnInit
{

  constructor
    (
      private userFacadeService: UserFacadeService
    ) { }

  ngOnInit(): void
  {
  }

  onSignIn()
  {
    this.userFacadeService.requestLogin();
  }

}
