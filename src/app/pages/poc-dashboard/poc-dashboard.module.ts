import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocDashboardRoutingModule } from './poc-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [SharedModule, PocDashboardRoutingModule],
})
export class PocDashboardModule {}
