import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FxApplicationComponent } from './fx-application.component';
import { InfoComponent } from './info/info.component';
import { ActionCode } from '@app/config/actionCode';
import { ApproveComponent } from './approve/approve.component';

const routes: Routes = [
  { 
    path: '', component: FxApplicationComponent, data: { title: 'fxApplication', key: 'fx-application',  shouldDetach: 'no' } 
  },
  { 
    path: 'info', component: InfoComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'fxApplication-Info', key: 'fx-application-info', shouldDetach: 'no' } 
  },
  { 
    path: 'approve', component: ApproveComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'fxApplication-Approve', key: 'fx-application-approve', shouldDetach: 'no' } 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxApplicationRoutingModule { }
