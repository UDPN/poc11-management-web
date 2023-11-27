import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { CurrencyRoutingModule } from './currency-routing.module';
import { AddComponent } from './add/add.component';
import { CurrencyComponent } from './currency.component';


@NgModule({
  declarations: [CurrencyComponent, AddComponent],
  imports: [
    CommonModule,
    SharedModule,
    CurrencyRoutingModule
  ]
})
export class CurrencyModule { }
