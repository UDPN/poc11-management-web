/*
 * @Author: chenyuting
 * @Date: 2024-12-23 11:23:36
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-24 15:09:21
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { NotificationsComponent } from './notifications.component';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { AddComponent } from './add/add/add.component';
import { InfoComponent } from './info/info/info.component';

@NgModule({
  declarations: [NotificationsComponent, AddComponent, InfoComponent],
  imports: [CommonModule, SharedModule, NotificationsRoutingModule]
})
export class NotificationsModule {}
