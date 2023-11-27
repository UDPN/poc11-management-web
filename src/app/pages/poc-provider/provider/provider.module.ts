import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { ProviderRoutingModule } from './provider-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    ProviderRoutingModule
  ]
})
export class ProviderModule { }
