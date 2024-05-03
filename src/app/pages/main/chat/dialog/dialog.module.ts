import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '@starley/ion-directives';

import { Ionic4EmojiPickerModule } from 'ionic4-emoji-picker';
import { DialogPageRoutingModule } from './dialog-routing.module';
import { DialogPage } from './dialog.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DialogPageRoutingModule,
        Ionic4EmojiPickerModule,
        DirectivesModule
    ],
    declarations: [DialogPage]
})
export class DialogPageModule { }
