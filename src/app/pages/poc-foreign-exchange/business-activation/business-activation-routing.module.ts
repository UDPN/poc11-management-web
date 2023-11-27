import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessActivationComponent } from './business-activation.component';

const routes: Routes = [{ path: '', component: BusinessActivationComponent, data: { title: 'businessaActivation', key: 'business-activation',  shouldDetach: 'no' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessActivationRoutingModule { }
