import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectivePreloadingStrategyService } from '@core/services/common/selective-preloading-strategy.service';

const routes: Routes = [
  { path: '', redirectTo: '/login/login-modify', pathMatch: 'full' },
  { path: 'login', data: { preload: true }, loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'poc', data: { preload: true }, loadChildren: () => import('./layout/default/default.module').then(m => m.DefaultModule) },
  { path: '**', redirectTo: '/poc/poc-dashboard/dashboard' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: SelectivePreloadingStrategyService,
      scrollPositionRestoration: 'top',
      
      useHash: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
