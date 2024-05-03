import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFirstPage } from './step-first.page';

const routes: Routes = [
  {
    path: '',
    component: StepFirstPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFirstPageRoutingModule {}
