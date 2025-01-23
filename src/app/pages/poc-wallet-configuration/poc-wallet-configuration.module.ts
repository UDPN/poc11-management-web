import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocWalletConfigurationRoutingModule } from './poc-wallet-configuration-routing.module';
import { WalletConfigurationComponent } from './wallet-configuration/wallet-configuration.component';

@NgModule({
  declarations: [WalletConfigurationComponent],
  imports: [SharedModule, PocWalletConfigurationRoutingModule]
})
export class PocWalletConfigurationModule {}
