import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { ForeignModelRoutingModule } from './foreign-model-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    ForeignModelRoutingModule
  ]
})
export class ForeignModelModule { }
