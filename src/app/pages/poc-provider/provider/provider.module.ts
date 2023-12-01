import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderComponent } from './provider.component';
import { InfoComponent } from './info/info.component';
import { ApproveComponent } from './approve/approve.component';


@NgModule({
  declarations: [ProviderComponent, InfoComponent, ApproveComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProviderRoutingModule
  ]
})
export class ProviderModule { }
