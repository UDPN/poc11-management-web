/*
 * @Author: chenyuting
 * @Date: 2024-12-24 13:31:42
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-17 13:46:09
 * @Description:
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocSystemRoutingModule } from './poc-system-routing.module';

@NgModule({
  imports: [SharedModule, PocSystemRoutingModule],
  declarations: []
})
export class PocSystemModule {}
