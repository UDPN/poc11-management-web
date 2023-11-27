import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocProviderRoutingModule } from './poc-provider-routing.module';
import { ProviderComponent } from './provider/provider.component';
import { InfoComponent } from './provider/info/info.component';
import { ApproveComponent } from './provider/approve/approve.component';

@NgModule({
  declarations: [ProviderComponent, InfoComponent, ApproveComponent],
  imports: [SharedModule, PocProviderRoutingModule],
})
export class PocProviderModule {}
