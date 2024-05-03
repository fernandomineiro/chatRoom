import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreditStatementPageRoutingModule } from './credit-statement-routing.module';

import { CreditStatementPage } from './credit-statement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreditStatementPageRoutingModule
  ],
  declarations: [CreditStatementPage]
})
export class CreditStatementPageModule {}
