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
      { path: '', redirectTo: 'poc-home', pathMatch: 'full' },
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
        path: 'poc-exchange-rate',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-exchange-rate/poc-exchange-rate.module').then(m => m.PocExchangeRateModule)
      },
      {
        path: 'poc-settlement',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-settlement/poc-settlement.module').then(m => m.PocSettlementModule)
      },
      {
        path: 'poc-central-bank',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-central-bank/poc-central-bank.module').then(m => m.PocCentralBankModule)
      },
      {
        path: 'poc-fx-transactions',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-fx-transactions/poc-fx-transactions.module').then(m => m.PocFxTransactionsModule)
      },
      {
        path: 'poc-commercial-bank',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-commercial-bank/poc-commercial-bank.module').then(m => m.PocCommercialBankModule)
      },
      {
        path: 'poc-foreign-model',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-foreign-model/poc-foreign-model.module').then(m => m.PocForeignModelModule)
      },
      {
        path: 'poc-system',
        data: { preload: true },
        loadChildren: () => import('../../pages/poc-system/poc-system.module').then(m => m.PocSystemModule)
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
