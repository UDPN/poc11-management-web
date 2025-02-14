/*
 * @Author: chenyuting
 * @Date: 2024-12-24 13:31:42
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-13 13:41:47
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'liquidity-pool', pathMatch: 'full' },
  {
    path: 'liquidity-pool',
    data: { preload: true },
    loadChildren: () =>
      import('./liquidity-pool/liquidity-pool.module').then(
        (m) => m.LiquidityPoolModule
      )
  },
  {
    path: 'pool-setting',
    data: { preload: true },
    loadChildren: () =>
      import('./liquidity-pool-setting/liquidity-pool-setting.module').then(
        (m) => m.LiquidityPoolSettingModule
      )
  },
  {
    path: 'fx-liquidity-provider',
    data: { preload: true },
    loadChildren: () =>
      import('./fx-liquidity-provider/fx-liquidity-provider.module').then(
        (m) => m.FxLiquidityProviderModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocProviderRoutingModule {}
