import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StepSecondPageRoutingModule } from './step-second-routing.module';

import { StepSecondPage } from './step-second.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepSecondPageRoutingModule,
    SharedModule
  ],
  declarations: [StepSecondPage]
})
export class StepSecondPageModule {}
