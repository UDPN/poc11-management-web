import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'fx-application', pathMatch: 'full' },
  {
    path: 'fx-application',
    data: { preload: true },
    loadChildren: () => import('./fx-application/fx-application.module').then(m => m.FxApplicationModule)
  },
  {
    path: 'fx-activation',
    data: { preload: true },
    loadChildren: () => import('./business-activation/business-activation.module').then(m => m.BusinessActivationModule)
  },
  {
    path: 'exchange-rate',
    data: { preload: true },
    loadChildren: () => import('./exchange-rate/exchange-rate.module').then(m => m.ExchangeRateModule)
  },
  {
    path: 'settlement',
    data: { preload: true },
    loadChildren: () => import('./settlement/settlement.module').then(m => m.SettlementModule)
  },
  {
    path: 'fx-transactions',
    data: { preload: true },
    loadChildren: () => import('./fx-transactions/fx-transactions.module').then(m => m.FxTransactionsModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocForeignExchangeRoutingModule { }
