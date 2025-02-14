/*
 * @Author: chenyuting
 * @Date: 2025-02-10 16:14:53
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-13 13:49:11
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidityPoolSettingComponent } from './liquidity-pool-setting.component';

const routes: Routes = [
  {
    path: '',
    component: LiquidityPoolSettingComponent,
    data: {
      title: 'liquidityPoolSetting',
      key: 'liquidity-pool-setting',
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidityPoolSettingRoutingModule {}
