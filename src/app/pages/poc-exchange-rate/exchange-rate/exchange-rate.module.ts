import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { ExchangeRateRoutingModule } from './exchange-rate-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    ExchangeRateRoutingModule
  ]
})
export class ExchangeRateModule { }
