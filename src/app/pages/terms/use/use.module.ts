import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsePageRoutingModule } from './use-routing.module';

import { UsePage } from './use.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsePageRoutingModule
  ],
  declarations: [UsePage]
})
export class UsePageModule {}
