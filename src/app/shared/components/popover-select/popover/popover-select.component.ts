import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-select',
  templateUrl: './popover-select.component.html',
  styleUrls: ['./popover-select.component.scss']
})
export class PopoverSelectComponent implements OnInit {

  @Input() title: string = ""
  @Input() items: any[] = null;
  @Input() valueKey: string = 'value'
  @Input() labelKey: string = 'label'
  @Input() original: any
  filtered: any[]
  search = '';
  selected: any
  constructor(
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.filtered = this.items
    if (this.original) {
      this.start()
    }
  }

  start() {
    for (let item of this.filtered) {
      if (this.original == item[this.valueKey])
        return this.selectItem(item)
    }  
  }

  selectItem(item) {
    if (!this.selected)
      return this.selected = item
    if (item[this.valueKey] == this.selected[this.valueKey])
      return this.selected = null
    this.selected = item
  }

  is_selected(item) { 
    if (!this.selected)
      return ''
    if (item[this.valueKey] == this.selected[this.valueKey])
      return 'selected'
    return ''
  }

  dismiss() {
    this.modal.dismiss()
  }

  close() {
    this.modal.dismiss(this.selected)
  }

  filter() {
    this.filtered = this.items.filter((value: string[]) => {
      if (
        this.formatted(value[this.labelKey])
          .includes(
            this.formatted(this.search)
          ))
        return value
      return false
    })
  }

  formatted(string: string) {
    return string.toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
  }
}
