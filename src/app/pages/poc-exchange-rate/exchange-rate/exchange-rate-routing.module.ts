import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeRateComponent } from './exchange-rate.component';

const routes: Routes = [{ path: '', component: ExchangeRateComponent, data: { title: 'exchangeRate', key: 'exchange-rate',  shouldDetach: 'no' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRateRoutingModule { }
