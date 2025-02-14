/*
 * @Author: chenyuting
 * @Date: 2024-12-24 13:31:41
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-14 11:37:13
 * @Description:
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocForeignExchangeRoutingModule } from './poc-foreign-exchange-routing.module';
import { TokenPairComponent } from './token-pair/token-pair.component';
import { AddComponent } from './token-pair/add/add.component';
import { InfoComponent } from './token-pair/info/info.component';

@NgModule({
  declarations: [TokenPairComponent, AddComponent, InfoComponent],
  imports: [SharedModule, PocForeignExchangeRoutingModule]
})
export class PocForeignExchangeModule {}
