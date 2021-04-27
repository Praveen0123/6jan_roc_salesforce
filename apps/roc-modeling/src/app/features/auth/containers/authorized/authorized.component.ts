import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserFacadeService } from '@app/+state/user';

@Component({
  selector: 'roc-authorized',
  templateUrl: './authorized.component.html',
  styleUrls: ['./authorized.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizedComponent implements OnInit
{
  constructor
    (
      private userFacadeService: UserFacadeService
    ) { }

  ngOnInit(): void
  {
    this.userFacadeService.requestUserAfterAuthentication();
  }

}
