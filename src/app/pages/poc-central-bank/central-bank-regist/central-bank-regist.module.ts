import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { CentralBankRegistRoutingModule } from './central-bank-regist-routing.module';
import { CentralBankRegistComponent } from './central-bank-regist.component';
import { AddComponent } from './add/add.component';
import { InfoComponent } from './info/info.component';


@NgModule({
  declarations: [CentralBankRegistComponent, AddComponent, InfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    CentralBankRegistRoutingModule
  ]
})
export class CentralBankRegistModule { }
