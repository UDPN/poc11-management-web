import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { SettlementComponent } from './settlement/settlement.component';
import { PocSettlementRoutingModule } from './poc-settlement-routing.module';
import { InfoComponent } from './settlement/info/info.component';

@NgModule({
  declarations: [SettlementComponent, InfoComponent],
  imports: [SharedModule, PocSettlementRoutingModule],
})
export class PocSettlementModule {}
