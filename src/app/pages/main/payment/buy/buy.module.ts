import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyPageRoutingModule } from './buy-routing.module';

import { DirectivesModule } from '@starley/ion-directives';
import { BuyPage } from './buy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BuyPageRoutingModule,
    DirectivesModule
  ],
  declarations: [BuyPage]
})

export class BuyPageModule {}

// End of file buy.module.ts
// Path: ./src/app/pages/payment/buy/buy.module.ts
