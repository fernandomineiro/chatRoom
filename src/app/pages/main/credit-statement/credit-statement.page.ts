import { Component, OnInit } from '@angular/core';
import { LoadingService, PlanService } from '../../../services/index';

@Component({
  selector: 'app-credit-statement',
  templateUrl: './credit-statement.page.html',
  styleUrls: ['./credit-statement.page.scss'],
})

export class CreditStatementPage implements OnInit {
  balance: any = 0;
  orders = [];

  constructor(
    private loadingService: LoadingService,
    private planService: PlanService
  ) {}

  ngOnInit() {
    this.loadingService.present();
    this.balance = localStorage.getItem('balance');

    this.planService.orders().subscribe((resp: any) => {
      this.loadingService.dismiss();

      this.orders = resp;
    }, err => {
      this.loadingService.dismiss();
      console.error(err);
    });
  }

}

// End of file credit-statement.page.ts
// Path: ./src/app/pages/credit-statement/credit-statement.page.ts
