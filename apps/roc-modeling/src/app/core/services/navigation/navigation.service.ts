import { Location } from '@angular/common';
import { Injectable, OnDestroy } from '@angular/core';
import { Event as NavigationEvent, NavigationExtras, NavigationStart, Router } from '@angular/router';
import { filter, map, takeWhile } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class NavigationService implements OnDestroy
{
  defaultNavigationExtras: NavigationExtras;
  private navigationId: number;
  private alive: boolean = true;

  ROUTES =
    {
      About: '/about',
      Home: '/',
      onBoarding: '/on-boarding',
      Modeling: '/modeling',
      ShareModel: '/share-model',
      Welcome: '/welcome'
    };

  constructor
    (
      private router: Router,
      private location: Location
    )
  {

    // https://www.bennadel.com/blog/3533-using-router-events-to-detect-back-and-forward-browser-navigation-in-angular-7-0-4.htm
    router.events
      .pipe
      (
        // The "events" stream contains all the navigation events. For this demo,
        // though, we only care about the NavigationStart event as it contains
        // information about what initiated the navigation sequence.
        filter((event: NavigationEvent) => (event instanceof NavigationStart)),
        takeWhile(() => this.alive),
        map((event: NavigationStart) =>
        {
          this.navigationId = event.id;

          // Every navigation sequence is given a unique ID. Even "popstate"
          // navigations are really just "roll forward" navigations that get
          // a new, unique ID.
          // The "navigationTrigger" will be one of:
          // --
          // - imperative (ie, user clicked a link).
          // - popstate (ie, browser controlled change such as Back button).
          // - hashchange
          // --
          // NOTE: I am not sure what triggers the "hashchange" type.

          // console.group('NavigationStart Event');
          // console.log('navigation id:', event.id);
          // console.log('route:', event.url);
          // console.log('trigger:', event.navigationTrigger);

          // This "restoredState" property is defined when the navigation
          // event is triggered by a "popstate" event (ex, back / forward
          // buttons). It will contain the ID of the earlier navigation event
          // to which the browser is returning.
          // --
          // CAUTION: This ID may not be part of the current page rendering.
          // This value is pulled out of the browser; and, may exist across
          // page refreshes.
          if (event.restoredState)
          {
            // console.warn('restoring navigation id:', event.restoredState.navigationId);

            this.navigationId = event.restoredState.navigationId;
          }

          // console.groupEnd();
        })
      )
      .subscribe();
  }

  ngOnDestroy()
  {
    this.alive = false;
  }

  // BACK
  goBack()
  {
    // console.log('navigationId', this.navigationId);
    if (this.navigationId > 1)
    {
      this.location.back();
    }
    else
    {
      this.goToModelingPage();
    }
  }

  goToAboutPage()
  {
    const url = `${this.ROUTES.About}`;
    this.router.navigate([url], this.defaultNavigationExtras);
  }
  goToHomePage()
  {
    const url = `${this.ROUTES.Home}`;
    this.router.navigate([url], this.defaultNavigationExtras);
  }
  goToModelingPage()
  {
    const url = `${this.ROUTES.Modeling}`;
    this.router.navigate([url], this.defaultNavigationExtras);
  }
  goToWelcomePage()
  {
    const url = `${this.ROUTES.Welcome}`;
    this.router.navigate([url], this.defaultNavigationExtras);
  }



  // ON BOARDING
  goToOnBoardingPage()
  {
    const url = `${this.ROUTES.onBoarding}`;
    this.router.navigate([url], this.defaultNavigationExtras);
  }
  goToOnBoardingUserTypePage()
  {
    const url = `${this.ROUTES.onBoarding}/user-type`;
    this.router.navigate([url], this.defaultNavigationExtras);
  }
  goToOnBoardingHighSchoolPage()
  {
    const url = `${this.ROUTES.onBoarding}/high-school`;
    this.router.navigate([url], this.defaultNavigationExtras);
  }
  goToOnBoardingWaitForValidation()
  {
    const url = `${this.ROUTES.onBoarding}/wait-for-validation`;
    this.router.navigate([url], this.defaultNavigationExtras);
  }



  // SHARE MODEL
  goToShareModelPage()
  {
    const url = `${this.ROUTES.ShareModel}`;
    this.router.navigate([url], this.defaultNavigationExtras);
  }
}
