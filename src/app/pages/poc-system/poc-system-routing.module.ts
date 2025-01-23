/*
 * @Author: chenyuting
 * @Date: 2024-12-24 13:31:42
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-23 17:21:35
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  {
    path: 'user',
    data: { preload: true },
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule)
  },
  {
    path: 'role',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocSystemRoutingModule {}
