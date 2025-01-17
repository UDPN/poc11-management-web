/*
 * @Author: chenyuting
 * @Date: 2025-01-17 13:43:04
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-17 13:44:53
 * @Description:
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { WalletConfigurationComponent } from './wallet-configuration.component';
import { WalletConfigurationComponentRoutingModule } from './wallet-configuration-routing.module';

@NgModule({
  declarations: [WalletConfigurationComponent],
  imports: [SharedModule, WalletConfigurationComponentRoutingModule]
})
export class WalletConfigurationModule {}
