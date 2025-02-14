/*
 * @Author: chenyuting
 * @Date: 2025-02-10 16:15:08
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-13 13:44:00
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { LiquidityPoolRoutingModule } from './liquidity-pool-routing.module';
import { LiquidityPoolComponent } from './liquidity-pool.component';
import { InfoComponent } from './info/info.component';
import { ApproveComponent } from './approve/approve.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

@NgModule({
  declarations: [
    LiquidityPoolComponent,
    InfoComponent,
    ApproveComponent,
    TransactionsComponent
  ],
  imports: [CommonModule, SharedModule, LiquidityPoolRoutingModule]
})
export class LiquidityPoolModule {}
