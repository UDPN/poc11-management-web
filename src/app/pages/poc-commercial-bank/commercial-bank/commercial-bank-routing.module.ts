import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommercialBankComponent } from './commercial-bank.component';
import { ActionCode } from '@app/config/actionCode';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  {
    path: '', component: CommercialBankComponent, data: { title: 'commercialBank', key: 'commercial-bank', shouldDetach: 'no' }
  },
  {
    path: 'info', component: InfoComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'commercialBank-Info', key: 'commercial-bank-info', shouldDetach: 'no' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommercialBankRoutingModule { }
