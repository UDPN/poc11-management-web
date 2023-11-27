import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForeignModelComponent } from './foreign-model.component';

const routes: Routes = [{ path: '', component: ForeignModelComponent, data: { title: 'foreignModel', key: 'foreign-model',  shouldDetach: 'no' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForeignModelRoutingModule { }
