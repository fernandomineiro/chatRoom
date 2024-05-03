import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService, LoadingService, ToastService } from '../../../../services/index';

@Component({
    selector: 'app-pending',
    templateUrl: './pending.page.html',
    styleUrls: ['./pending.page.scss'],
})

export class PendingPage implements OnInit {
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
            backUrl: '/main/chat/pending',
            id: user.id,
            image: user.sender.profile_image_url,
            title: user.sender.complete_title_text,
            sender: true,
            message: user.message,
            genderText: user.sender.sex_text,
            gender: JSON.stringify(user.sender.sex),
            interest: JSON.stringify(user.sender.interest),
            yourselfDeclaration: JSON.stringify(user.sender.declare_yourself),
            preferences: JSON.stringify(user.sender.preferences),
        }
        this.router.navigate(['/main/chat/modal']);
    }

    private loadData() {
        this.loadingService.present();

        this.chatService.pending().subscribe((resp: any) => {
            this.loadingService.dismiss();

            if (resp.status !== 'success') {
                this.toastService.present('Ocorreu um erro ao carregar as conversas pendenes.');
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

// End of file pending.page.ts
// Path: ./src/app/pages/chat/pending/pending.page.ts
