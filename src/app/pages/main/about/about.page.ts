import { Component, OnInit } from '@angular/core';
import { AlertService, EnumService, LoadingService } from '../../../services/index';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  content: string;

  constructor(
    private alertService: AlertService,
    private loadingService: LoadingService,
    private enumService: EnumService
  ) {}

  ngOnInit() {
    this.loadingService.present();

    this.enumService.settings().subscribe((resp: any) => {
      this.loadingService.dismiss();
      if (resp.status == 'failed') return this.alertService.present(resp.message);
      this.content = resp.about;
    });
  }
}

// End of file about.page.ts
// Path: ./src/app/pages/about/about.page.ts
