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
import { FxLiquidityProviderRoutingModule } from './fx-liquidity-provider-routing.module';
import { FxLiquidityProviderComponent } from './fx-liquidity-provider.component';

@NgModule({
  declarations: [FxLiquidityProviderComponent],
  imports: [CommonModule, SharedModule, FxLiquidityProviderRoutingModule]
})
export class FxLiquidityProviderModule {}
