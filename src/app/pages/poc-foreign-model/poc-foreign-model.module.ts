import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocForeignModelRoutingModule } from './poc-foreign-model-routing.module';
import { ForeignModelComponent } from './foreign-model/foreign-model.component';

@NgModule({
  declarations: [ForeignModelComponent],
  imports: [SharedModule, PocForeignModelRoutingModule],
})
export class PocForeignModelModule {}
