import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { CurrencyRoutingModule } from './currency-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    CurrencyRoutingModule
  ]
})
export class CurrencyModule { }
