import { Component, OnInit } from '@angular/core';
import { AlertService, EnumService, LoadingService } from '../../../services/index';

@Component({
  selector: 'use-terms',
  templateUrl: './use.page.html',
  styleUrls: ['./use.page.scss'],
})

export class UsePage implements OnInit {
  content: string;

  constructor(
    private alertService: AlertService,
    private loadingService: LoadingService,
    private enumService: EnumService
  ) { }

  ngOnInit() {
    this.loadingService.present();

    this.enumService.settings().subscribe((resp: any) => {
      this.loadingService.dismiss();
      if (resp.status == 'failed') return this.alertService.present(resp.message);
      this.content = resp.use_policy;
    });
  }
}

// End of file use.page.ts
// Path: ./src/app/pages/terms/use/use.page.ts
