import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocCentralBankRoutingModule } from './poc-central-bank-routing.module';

@NgModule({
  declarations: [],
  imports: [SharedModule, PocCentralBankRoutingModule],
})
export class PocCentralBankModule {}
