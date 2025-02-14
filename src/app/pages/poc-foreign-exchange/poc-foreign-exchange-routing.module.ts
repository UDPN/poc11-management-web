/*
 * @Author: chenyuting
 * @Date: 2024-12-24 13:31:41
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-13 14:19:23
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'token-pair', pathMatch: 'full' },
  {
    path: 'token-pair',
    data: { preload: true },
    loadChildren: () =>
      import('./token-pair/token-pair.module').then((m) => m.TokenPairModule)
  },
  {
    path: 'fx-transactions',
    data: { preload: true },
    loadChildren: () =>
      import('./fx-transactions/fx-transactions.module').then(
        (m) => m.FxTransactionsModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocForeignExchangeRoutingModule {}
