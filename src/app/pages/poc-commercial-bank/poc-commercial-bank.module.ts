import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { CommercialBankComponent } from './commercial-bank/commercial-bank.component';
import { PocCommercialBankRoutingModule } from './poc-commercial-bank-routing.module';
import { InfoComponent } from './commercial-bank/info/info.component';

@NgModule({
  declarations: [CommercialBankComponent, InfoComponent ],
  imports: [SharedModule, PocCommercialBankRoutingModule],
})
export class PocCommercialBankModule {}
