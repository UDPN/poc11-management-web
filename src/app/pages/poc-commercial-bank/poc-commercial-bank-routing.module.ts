import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'commercial-bank', pathMatch: 'full' },
  {
    path: 'commercial-bank',
    data: { preload: true },
    loadChildren: () => import('./commercial-bank/commercial-bank.module').then(m => m.CommercialBankModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocCommercialBankRoutingModule { }
