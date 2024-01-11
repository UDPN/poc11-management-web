import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'foreign-model', pathMatch: 'full' },
  {
    path: 'foreign-model',
    data: { preload: true },
    loadChildren: () => import('./foreign-model/foreign-model.module').then(m => m.ForeignModelModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocForeignModelRoutingModule { }
