import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StepFirstPageRoutingModule } from './step-first-routing.module';

import { StepFirstPage } from './step-first.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepFirstPageRoutingModule
  ],
  declarations: [StepFirstPage]
})
export class StepFirstPageModule {}
