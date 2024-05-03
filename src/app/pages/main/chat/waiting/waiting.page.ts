import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService, LoadingService, ToastService } from '../../../../services/index';

@Component({
    selector: 'app-waiting',
    templateUrl: './waiting.page.html',
    styleUrls: ['./waiting.page.scss'],
})

export class WaitingPage implements OnInit {
    users = [];
    userId = 0;
    private intervalId: any;
    constructor(
        private loadingService: LoadingService,
        private chatService: ChatService,
        private toastService: ToastService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadData();
    }

    async ngAfterContentInit() {
        this.intervalId = setInterval(() => {
            this.loadData();
        }, 20000);
    }

    ionViewWillLeave() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    openDetails(user: any) {
        this.chatService.info = {
            backUrl: '/main/chat/waiting',
            id: user.receiver.id,
            image: user.receiver.profile_image_url,
            title: user.receiver.complete_title_text,
            message: user.message,
            gender: JSON.stringify(user.receiver.sex),
            interest: JSON.stringify(user.receiver.interest),
            yourselfDeclaration: JSON.stringify(user.receiver.declare_yourself),
            preferences: JSON.stringify(user.receiver.preferences),
        }
        this.router.navigate(['/main/chat/modal']);
    }

    private loadData() {
        this.loadingService.present();

        this.chatService.waiting().subscribe((resp: any) => {
            this.loadingService.dismiss();

            if (resp.status !== 'success') {
                this.toastService.present('Ocorreu um erro ao carregar as conversas que estão aguardando resposta.');
            }

            for (let chat of resp.invite_chats) {
                let chatObj = chat.sender_id == this.userId ? chat.sender : chat.receiver;
                chatObj.chat_id = chat.id;

                this.users.push(chatObj);
            }

            this.users = resp.invite_chats;
        }, err => this.loadingService.dismiss());
    }
}

// End of file waiting.page.ts
// Path: ./src/app/pages/chat/waiting/waiting.page.ts
