import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'currency', pathMatch: 'full' },
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
export class PocCurrencyRoutingModule { }
