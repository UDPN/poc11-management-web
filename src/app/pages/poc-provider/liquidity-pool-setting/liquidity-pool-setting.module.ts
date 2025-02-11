/*
 * @Author: chenyuting
 * @Date: 2025-02-10 16:15:08
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-10 16:21:26
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { LiquidityPoolSettingComponent } from './liquidity-pool-setting.component';
import { LiquidityPoolSettingRoutingModule } from './liquidity-pool-setting-routing.module';

@NgModule({
  declarations: [LiquidityPoolSettingComponent],
  imports: [CommonModule, SharedModule, LiquidityPoolSettingRoutingModule]
})
export class LiquidityPoolSettingModule {}
