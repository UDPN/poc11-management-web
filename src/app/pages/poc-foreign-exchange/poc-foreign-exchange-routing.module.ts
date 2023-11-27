import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'fx-application', pathMatch: 'full' },
  {
    path: 'fx-application',
    data: { preload: true },
    loadChildren: () => import('./fx-application/fx-application.module').then(m => m.FxApplicationModule)
  },
  {
    path: 'business-activation',
    data: { preload: true },
    loadChildren: () => import('./business-activation/business-activation.module').then(m => m.BusinessActivationModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocForeignExchangeRoutingModule { }
