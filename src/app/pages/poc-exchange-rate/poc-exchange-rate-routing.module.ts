import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'exchange-rate', pathMatch: 'full' },
  {
    path: 'exchange-rate',
    data: { preload: true },
    loadChildren: () => import('./exchange-rate/exchange-rate.module').then(m => m.ExchangeRateModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocExchangeRateRoutingModule { }
