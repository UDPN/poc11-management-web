import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TokenPairRoutingModule } from './token-pair-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, TokenPairRoutingModule]
})
export class TokenPairModule {}
