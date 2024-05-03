import { Component, OnInit } from '@angular/core';
import { EnumService, LoadingService} from '../../../../services/index';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})

export class ListPage implements OnInit {
  plans = [];

  constructor(
    private enumService: EnumService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.present();

    this.enumService.plans().subscribe((resp: any) => {
      this.loadingService.dismiss();

      for (let plan of resp) {
        if (plan.enabled) this.plans.push(plan);
      }
    })
  }
}

// End of file list.page.ts
// Path: ./src/app/pages/payment/list/list.page.ts
