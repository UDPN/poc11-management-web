import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderComponent } from './provider.component';
import { InfoComponent } from './info/info.component';
import { ActionCode } from '@app/config/actionCode';
import { ApproveComponent } from './approve/approve.component';

const routes: Routes = [
  { 
    path: '', component: ProviderComponent, data: { title: 'Provider', key: 'provider',  shouldDetach: 'no' } 
  },
  { 
    path: 'info', component: InfoComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'Provider-Info', key: 'provider-info', shouldDetach: 'no' } 
  },
  { 
    path: 'approve', component: ApproveComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'Provider-Approve', key: 'provider-approve', shouldDetach: 'no' } 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
