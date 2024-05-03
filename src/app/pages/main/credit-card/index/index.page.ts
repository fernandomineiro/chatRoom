import { Component, OnInit } from '@angular/core';
import { AlertService, CardService, LoadingService, ToastService } from '../../../../services/index';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})

export class IndexPage implements OnInit {
  cards = [];

  constructor(
    private loadingService: LoadingService,
    private alertService: AlertService,
    private toastService: ToastService,
    private cardService: CardService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ionViewDidEnter() {
    this.loadData();
  }

  remove(cardId: number) {
    this.alertService.presentConfirm(() => {
      this.loadingService.present();

      this.cardService.delete(cardId).subscribe((resp: any) => {
        this.loadingService.dismiss();

        if (resp.status !== 'success')
          return this.alertService.present('Ocorreu um erro ao excluir este cartão.');

        this.loadData();
        this.toastService.present('Cartão excluído com sucesso!');

      })

    });
  }

  private loadData() {
    this.loadingService.present();

    this.cardService.all().subscribe((resp: any) => {
      this.loadingService.dismiss();
      this.cards = resp;
    });
  }
}

// End of file index.page.ts
// Path: ./src/app/pages/credit-card/index/index.page.ts
