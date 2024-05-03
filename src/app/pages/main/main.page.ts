import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AudioService } from 'src/app/services/audio/audio.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { AuthService, ChatService, UserService } from '../../services';
import { User } from '../../services/user/model';

@Component({
    selector: 'main-page',
    templateUrl: 'main.page.html',
    styleUrls: ['main.page.scss'],
})

export class MainPage {
    username: string;
    balance: number;
    user_id: number

    chat = {
        pending: 0,
        waiting: 0,
        active: 0
    }

    subscriptions: Subscription[]

    showContent: boolean = false;

    isAlreadyShow: boolean = false;

    constructor(
        private userService: UserService,
        private auth: AuthService,
        private alert: AlertController,
        private loading: LoadingController,
        private socket: SocketService,
        private router: Router,
        private chatService: ChatService,
        private audio: AudioService
    ) {
        this.subscriptions = []
        SplashScreen.hide();
    }

    ionViewWillEnter() {
        this.checkData();
    }

    ionViewWillLeave() {
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe()
        }
        this.subscriptions = []
    }

    private checkData() {
        setInterval(() => {
            this.userService.get().then((resp: User) => {

                this.chat.pending = resp.pendent_invites_count;
                this.chat.waiting = resp.waiting_answer_count;
                this.chat.active = resp.active_chats_count;

                localStorage.balance = resp.current_balance;
                localStorage.id = resp.id;
                localStorage.username = resp.name;
                this.user_id = resp.id
                this.username = resp.name;
                this.balance = resp.current_balance;

                this.showContent = resp.email === 'saladeencontrotesteloja@gmail.com' ? false : true;
            });
        }, 1000);

        this.subscriptions.push(this.socket.on_accept().subscribe(async accepted => {

            if (!this.isAlreadyShow) {
                this.isAlreadyShow = true;
                const alert = await this.alert.create({
                    message: accepted.message,
                    backdropDismiss: false,
                    buttons: [
                        {
                            text: 'Não',
                            role: 'cancel',
                            handler: () => {
                                console.log('Confirm Cancel: blah');
                                this.isAlreadyShow = false;
                            }
                        },
                        {
                            text: 'Sim',
                            handler: () => {
                                this.isAlreadyShow = false;
                                this.router.navigate(['/main/chat/dialog', accepted.invite_chat.receiver_id])
                            }
                        },
                    ]
                })
                // this.audio.notificationSound();
                alert.present()
            }
        }))
        this.subscriptions.push(this.socket.on_reject().subscribe(async denied => {
            if (!this.isAlreadyShow) {
                this.isAlreadyShow = true;
                const alert = await this.alert.create({
                    message: denied.message,
                    backdropDismiss: false,
                    buttons: [
                        {
                            text: 'OK',
                            role: 'cancel',
                            handler: () => {
                                console.log('Confirm Cancel: blah');
                                this.isAlreadyShow = false;
                            }
                        }
                    ]
                })
                // this.audio.notificationSound();
                alert.present()
            }
        }))
        this.subscriptions.push(this.socket.on_invite().subscribe(async invited => {

            if (this.balance <= 0) return this.alertWithoutCredit();

            if (!this.isAlreadyShow) {
                this.isAlreadyShow = true;
                const alert = await this.alert.create({
                    message: invited.message,
                    backdropDismiss: false,
                    buttons: [

                        {
                            text: 'Não',
                            role: 'cancel',
                            handler: () => {
                                console.log('Confirm Cancel: blah');
                                this.isAlreadyShow = false;
                            }
                        },
                        {
                            text: 'Sim',
                            handler: () => {
                                this.isAlreadyShow = false;
                                this.chatService.acceptInvite(invited.invite_chat_id).subscribe(data => {
                                    this.router.navigate(['/main/chat/dialog', invited.receiver_id])
                                })
                            }
                        },
                    ]
                })
                this.audio.notificationSound();
                alert.present()
            }
        }))
        this.subscriptions.push(this.socket.on_open().subscribe(async opened => {
            if (this.chatService.current_chat(opened.sender_id, opened.receiver_id)) {
                return console.log('ignore message')
            }
            if (this.balance <= 0) return this.alertWithoutCredit();

            if (!this.isAlreadyShow) {
                this.isAlreadyShow = true;
                const alert = await this.alert.create({
                    message: opened.message,
                    backdropDismiss: false,
                    buttons: [
                        {
                            text: 'Não',
                            role: 'cancel',
                            handler: () => {
                                console.log('Confirm Cancel: blah');
                                this.isAlreadyShow = false;
                            }
                        },
                        {
                            text: 'Sim',
                            handler: () => {
                                this.isAlreadyShow = false;
                                let id = opened.sender_id
                                if (this.user_id != opened.receiver_id) {
                                    id = opened.receiver_id
                                }
                                this.router.navigate(['/main/chat/dialog', id])
                            }
                        }
                    ]
                })
                this.audio.notificationSound();
                alert.present()
            }
        }))
    }

    async delete_confirmed() {
        const loading = await this.loading.create();
        await loading.present();
        this.userService.delete().subscribe(async (res) => {
            await this.auth.logout();
            loading.dismiss();
            this.router.navigate(['/auth/sign-in'])
        }, async (error) => {
            loading.dismiss()
            // const alert = await this.alertService.showInfoAlert('Atenção', 'Um erro ocorreu, entre em contato com o suporte.');
            // await alert.present();
        });
    }

    async alert_plano() {
        const confirm = await this.alert.create({
            header: 'Atenção',
            message: 'Confirmando, você perderá inclusive o tempo do plano vigente, caso tenha.',
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel'
                },
                {
                    text: 'Sim',
                    handler: async () => {
                        this.delete_confirmed()
                    }
                }
            ]
        });
        confirm.present()
    }

    async delete_account() {
        const confirm = await this.alert.create({
            header: 'Tem certeza que deseja excluir?',
            message: `Confirmando, os seus dados cadastrais serão excluídos.`,
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel'
                },
                {
                    text: 'Sim',
                    handler: async () => {
                        this.alert_plano()

                    }
                }
            ]
        });
        confirm.present()
    }

    async alertWithoutCredit() {
        const confirm = await this.alert.create({
            header: 'Você recebeu um convite!',
            message: `Mas está sem saldo para participar da conversa! <br><br> Deseja adquirir mais creditos?`,
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel'
                },
                {
                    text: 'Sim',
                    handler: async () => {
                        this.router.navigate(['/main/payment/list']);
                    }
                },
            ]
        });
        confirm.present()
    }

    touchLogout() {
        this.auth.logout();
        this.router.navigate(['/auth/sign-in']);
    }
}

// End of file app.component.ts
// Path: ./src/app/app.component.ts
