import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettlementComponent } from './settlement.component';
import { InfoComponent } from './info/info.component';
import { ActionCode } from '@app/config/actionCode';

const routes: Routes = [
  { 
    path: '', component: SettlementComponent, data: { title: 'Settlement', key: 'settlement',  shouldDetach: 'no' } 
  },
  { 
    path: 'info', component: InfoComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'Settlement-Info', key: 'settlement-info', shouldDetach: 'no' } 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettlementRoutingModule { }
