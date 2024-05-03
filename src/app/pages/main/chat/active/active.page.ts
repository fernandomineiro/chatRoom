import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BlockUserComponent } from 'src/app/shared/components/block-user/block-user.component';
import { IInviteChat } from '../../../../services/chat/interfaces';
import { ChatService, LoadingService, ToastService, UserService } from '../../../../services/index';

@Component({
    selector: 'app-active',
    templateUrl: './active.page.html',
    styleUrls: ['./active.page.scss'],
})

export class ActivePage implements OnInit {
    users: IInviteChat[] = [];
    userId = 0;

    private intervalId: any;
    disabledChatButton = false;

    constructor(
        private loadingService: LoadingService,
        private chatService: ChatService,
        private toastService: ToastService,
        private router: Router,
        private userService: UserService,
        private modalCtrl: ModalController,
        private zone: NgZone
    ) {
    }

    ngOnInit() {
        this.userId = parseInt(localStorage.getItem('id'));
        this.loadData();
    }

    async ngAfterContentInit() {
        let userData = await this.userService.get();
        if (userData.current_balance <= 0) {
            this.disabledChatButton = true;
        }

        this.intervalId = setInterval(() => {
            this.loadData();
        }, 20000);
    }

    ionViewWillLeave() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    private loadData() {
        this.chatService.active().subscribe((resp: any) => {
            this.loadingService.dismiss();
            if (resp.status !== 'success') {
                return this.toastService.present('Ocorreu um erro ao carregar as conversas ativas.');
            }
            this.users = resp.invite_chats;
        }, err => this.loadingService.dismiss());
    }

    async touchOpenChat(chat: any) {
        this.router.navigate(['/main/chat/dialog/' + chat.id]);
    }

    touchBackToHome() {
        this.router.navigate(['/main/home']);
    }

    async touchBlockUser(user: any) {
        const popover = await this.modalCtrl.create({
            component: BlockUserComponent,
            cssClass: 'scss',
            componentProps: { user: user }
        });

        await popover.present();

        await popover.onDidDismiss().then((data) => {
            if (data.data === 'block_user') {
                this.zone.run(() => { this.loadData(); });
            }
        });

    }
}

// End of file active.page.ts
// Path: ./src/app/pages/chat/active/active.page.ts
