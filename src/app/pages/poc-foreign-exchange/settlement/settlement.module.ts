import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SettlementRoutingModule } from './settlement-routing.module';
import { SettlementComponent } from './settlement.component';
import { InfoComponent } from './info/info.component';


@NgModule({
  declarations: [SettlementComponent, InfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    SettlementRoutingModule
  ]
})
export class SettlementModule { }
