import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Preference } from 'src/app/services/preferences/interface';
import { EnumService, ToastService } from '../../../services/index';

@Component({
    selector: 'preferences-list',
    templateUrl: './preferences-list.component.html',
    styleUrls: ['./preferences-list.component.scss'],
})

export class PreferencesListComponent implements OnInit {
    @Output() selected: EventEmitter<number[]>
    @Input() init: number[] = []
    list: Preference[]
    private _selected: number[]
    constructor(
        private enums: EnumService,
        private toast: ToastService
    ) {
        this.selected = new EventEmitter;

    }

    ngOnInit(): void {
        this._selected = []
        this.list = this.enums.getDefault('preferences');
        this._selected = [...this.init];
        this.list.forEach((item) => {
            item.checked = this._selected.includes(item.id);
        });
    }


    // onCheckboxChange(e) {
    //   const preferences: FormArray = this.formData.get('preferences') as FormArray;

    //   if (e.target.checked) {
    //     preferences.push(new FormControl(e.target.value));
    //   } else {
    //     const index = preferences.controls.findIndex(x => x.value === e.target.value);
    //     preferences.removeAt(index);
    //   }

    //   if (preferences.controls.length > 3) {
    //     this.toastService.present('Escolha somente 3 preferências.');
    //     e.target.checked = false;
    //     return;
    //   }
    // }
    select(event) {
        const checked = event.detail.checked
        const value = parseInt(event.detail.value)
        if (checked) {
            return this.insert(value, event.target)
        }
        return this.remove(value)
    }

    insert(value, target) {
        if (this.list.filter(item => item.checked).length > 3) {
            this.toast.present('Escolha somente 3 preferências.');
            target.checked = false
            return;
        }
        const index = this._selected.indexOf(value)
        if (index > -1)
            return;
        this._selected.push(value)
        this.selected.emit(this._selected)
        console.log(this._selected)

    }

    remove(value) {
        const index = this._selected.indexOf(value)
        if (index == -1)
            return
        this._selected.splice(index, 1)
        this.selected.emit(this._selected)
        console.log(this._selected)

    }
}
