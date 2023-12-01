import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'provider', pathMatch: 'full' },
  {
    path: 'provider',
    data: { preload: true },
    loadChildren: () => import('./provider/provider.module').then(m => m.ProviderModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocProviderRoutingModule { }
