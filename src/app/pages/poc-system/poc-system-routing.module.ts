import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  {
    path: 'user',
    data: { preload: true },
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule)
  },
  {
    path: 'role',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule)
  },
  {
    path: 'wallet-configuration',
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
export class PocSystemRoutingModule {}
