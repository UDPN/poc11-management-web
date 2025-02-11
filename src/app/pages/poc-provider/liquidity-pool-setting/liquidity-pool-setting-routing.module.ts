import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidityPoolSettingComponent } from './liquidity-pool-setting.component';

const routes: Routes = [
  {
    path: '',
    component: LiquidityPoolSettingComponent,
    data: {
      title: 'LiquidityPoolSetting',
      key: 'liquidityPoolSetting',
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidityPoolSettingRoutingModule {}
