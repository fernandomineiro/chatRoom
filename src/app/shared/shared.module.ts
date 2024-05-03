import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { DirectivesModule } from '@starley/ion-directives';
import { BlockUserComponent } from "./components/block-user/block-user.component";
import { PopoverComponent } from "./components/popover-component/popover-component";
import { PopoverSelectComponent } from "./components/popover-select/popover/popover-select.component";
import { SelectComponent } from "./components/popover-select/select/select.component";
import { PreferencesListComponent } from "./components/preferences-list/preferences-list.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { MaskDirective } from "./directives/mask.directive";

@NgModule({
    declarations: [
      PopoverSelectComponent,
      SelectComponent,
      ProfileComponent,
      PreferencesListComponent,
      MaskDirective,
      PopoverComponent,
      BlockUserComponent
  ],
  exports: [
      FormsModule,
      PopoverSelectComponent,
      SelectComponent,
      ProfileComponent,
      PreferencesListComponent,
      MaskDirective,
      PopoverComponent,
      BlockUserComponent
  ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        DirectivesModule
    ],
    entryComponents: [
        PopoverSelectComponent,
        SelectComponent,
        ProfileComponent,
        PreferencesListComponent,
        PopoverComponent,
        BlockUserComponent
    ]
})
export class SharedModule {}
