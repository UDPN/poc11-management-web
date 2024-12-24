/*
 * @Author: chenyuting
 * @Date: 2024-12-09 15:40:52
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-24 15:42:30
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { NotificationsComponent } from './notifications.component';
import { AddComponent } from './add/add/add.component';

const routes: Routes = [
  {
    path: '', component: NotificationsComponent, data: { title: 'Notifications', key: 'notifications', shouldDetach: 'no' }
  },
  { 
    path: 'add', component: AddComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'Notifications-Create', key: 'notifications-add', shouldDetach: 'no' } 
  },
  // { path: '**', redirectTo: '/poc/poc-activate-settlement/activate-settlement/info' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
