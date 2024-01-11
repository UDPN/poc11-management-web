import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocForeignExchangeRoutingModule } from './poc-foreign-exchange-routing.module';
import { BusinessActivationComponent } from './business-activation/business-activation.component';

@NgModule({
  declarations: [],
  imports: [SharedModule, PocForeignExchangeRoutingModule],
})
export class PocForeignExchangeModule {}
