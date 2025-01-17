import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletConfigurationComponent } from './wallet-configuration.component';

const routes: Routes = [
  {
    path: '',
    component: WalletConfigurationComponent,
    data: {
      title: 'Wallet Configuration',
      key: 'walletConfiguration',
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletConfigurationComponentRoutingModule {}
