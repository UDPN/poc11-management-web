import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { BusinessActivationRoutingModule } from './business-activation-routing.module';
import { BusinessActivationComponent } from './business-activation.component';


@NgModule({
  declarations: [BusinessActivationComponent],
  imports: [
    CommonModule,
    SharedModule,
    BusinessActivationRoutingModule
  ]
})
export class BusinessActivationModule { }
