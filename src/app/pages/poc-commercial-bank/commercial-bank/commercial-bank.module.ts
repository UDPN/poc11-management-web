import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { CommercialBankRoutingModule } from './commercial-bank-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    CommercialBankRoutingModule
  ]
})
export class CommercialBankModule { }
