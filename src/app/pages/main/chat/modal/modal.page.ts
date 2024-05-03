import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ChatService, LoadingService, ToastService } from '../../../../services/index';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})

export class ModalPage implements OnInit {
  actionButton = 'Enviar convite';
  backButton: string;
  message: string;
  showForm = true;
  sender = false;
  genderText: string;

  user = {
    id: 0,
    image: '',
    title: '',
    gender: {name: '', id: '', icon_url: ''},
    interest: {name: '', id: '', icon_url: ''},
    yourselfDeclaration: {name: '', id: '', icon_url: ''},
    preferences: [],
    message: ''
  }

  constructor(
    private loadingService: LoadingService,
    private toastService: ToastService,
    private router: Router,
    private chatService: ChatService
  ) { }

  ionViewWillEnter() {
    this.loadUserData()
  }

  ngOnInit() {
  }

  ionViewDidLeave() {
    this.resetMessage();
  }

  invite() {
    this.loadingService.present();
    this.chatService.invite(this.user.id, this.message).subscribe((resp: any) => {
      this.loadingService.dismiss();

      if (resp.status !== 'success') {
        return this.toastService.present(resp.errors_message);
      }

      this.resetMessage();
      this.toastService.present('Seu convite foi enviado!');
      this.router.navigate([this.backButton]);
    }, err => {
      this.loadingService.dismiss();
    });
  }

  startChat() {
    this.loadingService.present();
    this.chatService.acceptInvite(this.user.id).subscribe((resp: any) => {
      this.loadingService.dismiss();

      if (resp.status !== 'success') {
        return this.toastService.present(resp.errors_message);
      }

      this.resetMessage();
      this.toastService.present('Convite aceito!');
      this.router.navigate(['/main/chat/dialog']);
    }, err => {
      this.loadingService.dismiss();
    });
  }

  declineInvite() {
    this.loadingService.present();
    this.chatService.declineInvite(this.user.id).subscribe((resp: any) => {
      this.loadingService.dismiss();

      if (resp.status !== 'success') {
        return this.toastService.present(resp.errors_message);
      }

      this.resetMessage();
      this.toastService.present('Convite cancelado!');
      this.router.navigate([this.backButton]);
    }, err => {
      this.loadingService.dismiss();
    });
  }

  private loadUserData() {
    const params = this.chatService.info
    if (!params)
      this.router.navigate(['/main/home'])
    this.backButton = params.backUrl;
    this.user.id = <number> params.id;
    this.user.image = params.image;
    this.user.title = params.title;
    this.user.gender = JSON.parse(params.gender);
    this.user.interest = JSON.parse(params.interest);
    this.user.yourselfDeclaration = JSON.parse(params.yourselfDeclaration);
    this.user.preferences = JSON.parse(params.preferences);
    if (params.message?.length > 0) {
      this.message = params.message;
      this.showForm = false;
      if (params.sender == true) {
        this.sender = true;
        this.genderText = params.genderText;
      } else {
        this.sender = false
      }
    }
  }

  private resetMessage() {
    this.message = '';
    this.showForm = true;
    this.sender = false;
    this.genderText = '';
  }
}

// End of file modal.page.ts
// Path: ./src/app/pages/chat/modal/modal.page.ts
