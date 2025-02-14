/*
 * @Author: chenyuting
 * @Date: 2025-02-13 13:34:44
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-14 10:44:00
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidityPoolComponent } from './liquidity-pool.component';
import { InfoComponent } from './info/info.component';
import { ActionCode } from '@app/config/actionCode';
import { ApproveComponent } from './approve/approve.component';

const routes: Routes = [
  {
    path: '',
    component: LiquidityPoolComponent,
    data: {
      title: 'liquidityPool',
      key: 'liquidity-pool',
      shouldDetach: 'no'
    }
  },
  {
    path: 'info',
    component: InfoComponent,
    data: {
      newTab: 'true',
      authCode: ActionCode.TabsDetail,
      title: 'liquidityPool-Info',
      key: 'liquidity-pool-info',
      shouldDetach: 'no'
    }
  },
  {
    path: 'approve',
    component: ApproveComponent,
    data: {
      newTab: 'true',
      authCode: ActionCode.TabsDetail,
      title: 'liquidityPool-Approve',
      key: 'liquidity-pool-approve',
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidityPoolRoutingModule {}
