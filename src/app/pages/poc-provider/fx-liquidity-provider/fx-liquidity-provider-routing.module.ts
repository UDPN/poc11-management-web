import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FxLiquidityProviderComponent } from './fx-liquidity-provider.component';

const routes: Routes = [
  {
    path: '',
    component: FxLiquidityProviderComponent,
    data: {
      title: 'fxLiquidityProvider',
      key: 'fx-liquidity-provider',
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxLiquidityProviderRoutingModule {}
