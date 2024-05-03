import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'app-popover-component',
    templateUrl: './popover-component.html',
    styleUrls: ['./popover-component.scss'],
})
export class PopoverComponent implements OnInit {

    @Input() message = '';

    constructor(private popoverController: PopoverController) { }

    ngOnInit() { }

    closePopover() {
        this.popoverController.dismiss();
    }

}
