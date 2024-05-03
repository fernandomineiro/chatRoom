import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditStatementPage } from './credit-statement.page';

const routes: Routes = [
  {
    path: '',
    component: CreditStatementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditStatementPageRoutingModule {}
