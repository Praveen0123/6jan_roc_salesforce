import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { CoreModule } from '@core/core.module';
import { environment } from '@env/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Store } from '@ngrx/store';
import { SharedModule } from '@shared/shared.module';
import { RootStoreModule } from '@state/root-store.module';

import { requestTenant } from './+state/tenant/actions';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonUIModule } from './features/common-ui/common-ui.module';
import { GraphQLModule } from './graphql.module';


// 3rd PARTY
@NgModule({
  imports:
    [
      AppRoutingModule,
      AuthModule.forRoot(
        {
          ...environment.auth,
          httpInterceptor:
          {
            ...environment.httpInterceptor,
          },
        }),
      BrowserModule,
      BrowserAnimationsModule,
      CommonUIModule,
      CoreModule,
      FontAwesomeModule,
      GraphQLModule,
      HttpClientModule,
      RootStoreModule,
      SharedModule
    ],
  declarations:
    [
      AppComponent
    ],
  providers:
    [
      {
        provide: APP_INITIALIZER,
        useFactory: (store: Store) =>
        {
          return () => store.dispatch(requestTenant());
        },
        multi: true,
        deps: [Store]
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthHttpInterceptor,
        multi: true
      },
    ],
  bootstrap:
    [
      AppComponent
    ],
})
export class AppModule { }
