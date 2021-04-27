import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NavigationService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate
{
  constructor
    (
      private authService: AuthService,
      private navigationService: NavigationService
    ) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    return this.authService.isAuthenticated$
      .pipe
      (
        map((isAuthenticated: boolean) =>
        {
          if (isAuthenticated)
          {
            return true;
          }

          this.navigationService.goToWelcomePage();

          return false;
        })
      );

  }
}
