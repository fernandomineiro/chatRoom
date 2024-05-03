import { Component, OnInit } from '@angular/core';
import { AlertService, EnumService, LoadingService } from '../../../services/index';

@Component({
  selector: 'privacy-terms',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})

export class PrivacyPage implements OnInit {
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
      this.content = resp.privacy_policy;
    });
  }
}

// End of file privacy.page.ts
// Path: ./src/app/pages/terms/privacy/privacy.page.ts
