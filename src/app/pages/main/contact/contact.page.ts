import { Component, OnInit } from '@angular/core';
import { AlertService, EnumService, ToastService, LoadingService, SupportContactService } from '../../../services/index';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})

export class ContactPage implements OnInit {
  formData: FormGroup;
  email: string;
  subjects = [];

  constructor(
    private alertService: AlertService,
    private loadingService: LoadingService,
    private enumService: EnumService,
    private toastService: ToastService,
    private router: Router,
    private supportContactService: SupportContactService,
    private formBuilder: FormBuilder
  ) {
    this.formData = this.formBuilder.group({
      subjectId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadingService.present();

    this.enumService.settings().subscribe((resp: any) => {
      this.loadingService.dismiss();
      if (resp.status == 'failed') {
        return this.alertService.present(resp.message);
      }
      this.email = resp.contact_mail;
    });

    this.enumService.contactSubjects().subscribe((resp: any) => {
      this.subjects = resp;
    }, err => console.error(err));
  }

  send() {
    this.loadingService.present();

    this.supportContactService.create(this.formData).subscribe((resp: any) => {
      this.loadingService.dismiss();

      if (resp.status !== 'success') {
        return this.alertService.present(resp.errors_message);
      }

      this.toastService.present('Sua mensagem foi enviada para nossa equipe.');
      this.router.navigate(['home']);

    }, err => {
      console.error(err);
      this.loadingService.dismiss();
    });
  }
}

// End of file contact.page.ts
// Path: ./src/app/pages/contact/contact.page.ts
