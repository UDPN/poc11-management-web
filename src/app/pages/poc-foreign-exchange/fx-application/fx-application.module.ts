import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { FxApplicationRoutingModule } from './fx-application-routing.module';
import { InfoComponent } from './info/info.component';
import { FxApplicationComponent } from './fx-application.component';
import { ApproveComponent } from './approve/approve.component';


@NgModule({
  declarations: [FxApplicationComponent, InfoComponent, ApproveComponent],
  imports: [
    CommonModule,
    SharedModule,
    FxApplicationRoutingModule
  ]
})
export class FxApplicationModule { }
