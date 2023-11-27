import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentralBankRegistComponent } from './central-bank-regist.component';
import { AddComponent } from './add/add.component';
import { ActionCode } from '@app/config/actionCode';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  { 
    path: '', component: CentralBankRegistComponent, data: { title: 'centralBankRegist', key: 'central-bank-regist',  shouldDetach: 'no' } 
  },
  { 
    path: 'info', component: InfoComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'centralBankRegist-Info', key: 'central-bank-regist-info', shouldDetach: 'no' } 
  },
  { 
    path: 'add', component: AddComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'centralBankRegist-Create', key: 'central-bank-regist-add', shouldDetach: 'no' } 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentralBankRegistRoutingModule { }
