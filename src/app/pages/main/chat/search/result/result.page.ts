import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, ChatService, LoadingService } from '../../../../../services/index';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})

export class ResultPage implements OnInit {
  users = [];
  page: number
  constructor(
    private chatService: ChatService,
    private loadingService: LoadingService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loadingService.present();
    this.page = 1
    this.users = []
    this.load_users()
  }

  load_users() {
    this.chatService.search(this.page).subscribe((resp: any) => {
      this.loadingService.dismiss();

      if (resp.status !== 'success') {
        return this.alertService.present('Ocorreu um erro ao carregar os usuários. Tente novamente mais tarde.');
      }

      this.users = this.users.concat(resp.users);

    }, err => this.loadingService.dismiss())
  
  }

  sendInvite(user: any) {
    this.chatService.info = 
      {
        backUrl: '/main/chat/search/form',
        id: user.id,
        image: user.profile_image_url,
        title: user.complete_title_text,
        gender: JSON.stringify(user.sex),
        interest: JSON.stringify(user.interest),
        yourselfDeclaration: JSON.stringify(user.declare_yourself),
        preferences: JSON.stringify(user.preferences),
      }
    this.router.navigate(['/main/chat/modal']);
  }

}

// End of file result.page.ts
// Path: ./src/app/pages/chat/search/result/result.page.ts
