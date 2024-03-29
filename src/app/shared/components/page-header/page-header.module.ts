import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SHARED_ZORRO_MODULES } from '@shared/shared-zorro.module';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';

import { PageHeaderComponent } from './page-header.component';

@NgModule({
  declarations: [PageHeaderComponent],
  imports: [CommonModule, SHARED_ZORRO_MODULES, NzOutletModule,RouterModule],
  exports: [PageHeaderComponent]
})
export class PageHeaderModule {}
