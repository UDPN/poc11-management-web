import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyComponent } from './currency.component';
import { AddComponent } from './add/add.component';
import { ActionCode } from '@app/config/actionCode';

const routes: Routes = [
  { 
    path: '', component: CurrencyComponent, data: { title: 'Currency', key: 'currency',  shouldDetach: 'no' } 
  },
  { 
    path: 'add', component: AddComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'Currency-Create', key: 'currency-add', shouldDetach: 'no' } 
  },
  { 
    path: 'edit', component: AddComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'Currency-Edit', key: 'currency-edit', shouldDetach: 'no' } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrencyRoutingModule { }
