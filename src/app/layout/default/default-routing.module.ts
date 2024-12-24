/*
 * @Author: chenyuting
 * @Date: 2024-07-08 16:17:34
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-24 14:12:27
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JudgeAuthGuard } from '@core/services/common/guard/judgeAuth.guard';
import { JudgeLoginGuard } from '@core/services/common/guard/judgeLogin.guard';
import { DefaultComponent } from './default.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    data: { shouldDetach: 'no', preload: true },
    canActivateChild: [JudgeLoginGuard, JudgeAuthGuard],
    children: [
      { path: '', redirectTo: 'poc-dashboard', pathMatch: 'full' },
      {
        path: 'poc-dashboard',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-dashboard/poc-dashboard.module').then(m => m.PocDashboardModule)
      },
      {
        path: 'poc-home',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-home/poc-home.module').then(m => m.PocHomeModule)
      },
      {
        path: 'poc-foreign-exchange',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-foreign-exchange/poc-foreign-exchange.module').then(m => m.PocForeignExchangeModule)
      },
      {
        path: 'poc-central-bank',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-central-bank/poc-central-bank.module').then(m => m.PocCentralBankModule)
      },
      {
        path: 'poc-commercial-bank',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-commercial-bank/poc-commercial-bank.module').then(m => m.PocCommercialBankModule)
      },
      {
        path: 'poc-provider',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-provider/poc-provider.module').then(m => m.PocProviderModule)
      },
      {
        path: 'poc-system',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-system/poc-system.module').then(m => m.PocSystemModule)
      },
      {
        path: 'poc-notifications', 
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-notifications/poc-notifications.module').then(
            (m) => m.PocNotificationsModule
          )
      },
      {
        path: 'system',
        loadChildren: () => import('../../pages/system/system.module').then(m => m.SystemModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }
