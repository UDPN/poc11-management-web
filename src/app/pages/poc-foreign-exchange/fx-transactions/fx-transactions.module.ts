import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { FxTransactionsRoutingModule } from './fx-transactions-routing.module';
import { FxTransactionsComponent } from './fx-transactions.component';
import { InfoComponent } from './info/info.component';


@NgModule({
  declarations: [FxTransactionsComponent, InfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    FxTransactionsRoutingModule
  ]
})
export class FxTransactionsModule { }
