import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'wallet-configuration', pathMatch: 'full' },
  {
    path: 'wallet-configuration',
    data: { preload: true },
    loadChildren: () =>
      import('./wallet-configuration/wallet-configuration.module').then(
        (m) => m.WalletConfigurationModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocWalletConfigurationRoutingModule {}
