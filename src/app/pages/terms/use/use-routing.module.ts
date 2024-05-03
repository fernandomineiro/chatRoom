import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsePage } from './use.page';

const routes: Routes = [
  {
    path: '',
    component: UsePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsePageRoutingModule {}
