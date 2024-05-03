import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { PopoverSelectItem } from '../interfaces';
import { PopoverSelectComponent } from '../popover/popover-select.component';

@Component({
  selector: 'popover-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @Output() change: EventEmitter<any>
  @Input() title: string = ""
  @Input() items: PopoverSelectItem[] = null;
  @Input() placeholder: string = ""
  @Input() labelKey: string = "label"
  @Input() valueKey: string = "value"
  @Input() selected: any
  label
  constructor(
      private popoverController: ModalController
  ) { 
    this.change = new EventEmitter
  }

  ngOnInit() {
  }
  
  async open() {
    if (this.items.length === 0)
      return false
    const popover = await this.popoverController.create({
      component: PopoverSelectComponent,
      // translucent: false,
      componentProps: {
        title: this.title,
        items: this.items,
        labelKey: this.labelKey,
        valueKey: this.valueKey,
        original: this.selected
      },
      animated: false
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data) {
      this.change.emit(data[this.valueKey]);
      this.label = data[this.labelKey]
      console.log(this.label, data)
      data[this.valueKey]
    }
  }
  
  set_selected(label) {
    this.label = label
  }

}
