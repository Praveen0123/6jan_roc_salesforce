import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { PageNotFoundComponent } from './features/common-ui/containers/page-not-found/page-not-found.component';

const routes: Routes =
  [
    {
      path: '',
      redirectTo: '/authorized',
      pathMatch: 'full'
    },
    {
      path: 'authorized',
      loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'on-boarding',
      loadChildren: () => import('./features/on-boarding/on-boarding.module').then(m => m.OnBoardingModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'modeling',
      loadChildren: () => import('./features/modeling-tool/modeling-tool.module').then(m => m.ModelingToolModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'compare-models',
      loadChildren: () => import('./features/compare/compare.module').then(m => m.CompareModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'share-model',
      loadChildren: () => import('./features/share-model/share-model.module').then(m => m.ShareModelModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'welcome',
      loadChildren: () => import('./features/welcome/welcome.module').then(m => m.WelcomeModule)
    },
    {
      path: 'about',
      loadChildren: () => import('./features/about/about.module').then(m => m.AboutModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'page-not-found',
      component: PageNotFoundComponent
    },
    {
      path: '**',
      redirectTo: '/page-not-found'
    }
  ];

@NgModule(
  {
    imports:
      [
        RouterModule.forRoot(routes,
          {
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled',
            relativeLinkResolution: 'legacy'
          })
      ],
    exports:
      [
        RouterModule
      ]
  })

export class AppRoutingModule { }
