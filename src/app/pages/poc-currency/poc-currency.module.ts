import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocCurrencyRoutingModule } from './poc-currency-routing.module';
import { CurrencyComponent } from './currency/currency.component';
import { AddComponent } from './currency/add/add.component';

@NgModule({
  declarations: [CurrencyComponent, AddComponent],
  imports: [SharedModule, PocCurrencyRoutingModule],
})
export class PocCurrencyModule {}
