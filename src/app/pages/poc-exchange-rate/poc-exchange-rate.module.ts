import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocExchangeRateRoutingModule } from './poc-exchange-rate-routing.module';
import { ExchangeRateComponent } from './exchange-rate/exchange-rate.component';

@NgModule({
  declarations: [ExchangeRateComponent],
  imports: [SharedModule, PocExchangeRateRoutingModule],
})
export class PocExchangeRateModule {}
