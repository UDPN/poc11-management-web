/*
 * @Author: chenyuting
 * @Date: 2025-02-13 13:44:58
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-14 11:36:30
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { TokenPairComponent } from './token-pair.component';
import { InfoComponent } from './info/info.component';
import { AddComponent } from './add/add.component';

const routes: Routes = [
  {
    path: '',
    component: TokenPairComponent,
    data: {
      title: 'tokenPair',
      key: 'token-pair',
      shouldDetach: 'no'
    }
  },
  {
    path: 'info',
    component: InfoComponent,
    data: {
      newTab: 'true',
      authCode: ActionCode.TabsDetail,
      title: 'tokenPair-Info',
      key: 'token-pair-info',
      shouldDetach: 'no'
    }
  },
  {
    path: 'add',
    component: AddComponent,
    data: {
      newTab: 'true',
      authCode: ActionCode.TabsDetail,
      title: 'tokenPair-Add',
      key: 'token-pair-add',
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TokenPairRoutingModule {}
