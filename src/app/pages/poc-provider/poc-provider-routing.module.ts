/*
 * @Author: chenyuting
 * @Date: 2024-12-24 13:31:42
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-23 17:18:56
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'provider', pathMatch: 'full' },
  {
    path: 'provider',
    data: { preload: true },
    loadChildren: () =>
      import('./provider/provider.module').then((m) => m.ProviderModule)
  },
  {
    path: 'liquidity-pool-setting',
    data: { preload: true },
    loadChildren: () =>
      import('./liquidity-pool-setting/liquidity-pool-setting.module').then(
        (m) => m.LiquidityPoolSettingModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocProviderRoutingModule {}
