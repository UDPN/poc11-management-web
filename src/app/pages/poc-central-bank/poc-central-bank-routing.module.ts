import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'central-bank-regist', pathMatch: 'full' },
  {
    path: 'central-bank-regist',
    data: { preload: true },
    loadChildren: () => import('./central-bank-regist/central-bank-regist.module').then(m => m.CentralBankRegistModule)
  },
  {
    path: 'currency',
    data: { preload: true },
    loadChildren: () => import('./currency/currency.module').then(m => m.CurrencyModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocCentralBankRoutingModule { }
