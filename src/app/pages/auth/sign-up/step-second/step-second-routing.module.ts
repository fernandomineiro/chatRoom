import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepSecondPage } from './step-second.page';

const routes: Routes = [
  {
    path: '',
    component: StepSecondPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepSecondPageRoutingModule {}
