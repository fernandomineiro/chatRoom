import { Component, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { App } from '@capacitor/app';
import { AlertController, IonContent, IonTextarea, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertService, ChatService, LoadingService, ToastService, UserService } from 'src/app/services';
import { AudioService } from 'src/app/services/audio/audio.service';
import { ChatReceivedMessage, IChatMessage, SocketMessage } from 'src/app/services/chat/interfaces';
import { ImageService } from 'src/app/services/image/image.service';
import { Actions, SocketService } from 'src/app/services/socket/socket.service';
import { User } from 'src/app/services/user/model';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.page.html',
    styleUrls: ['./dialog.page.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class DialogPage implements OnInit {
    private id: number
    message: string = '';
    messages: IChatMessage[]
    show_message: string
    private sender: User
    private subscriptions: Subscription[];

    @ViewChild(IonTextarea) textarea: IonTextarea;

    current_balance = 0;
    showEmojiPicker = false;
    currentChat: User = new User();

    @ViewChild('player') player: HTMLAudioElement
    audio: SafeResourceUrl

    private appIsInBackground = false;
    private shouldReconnectWebSocket = false;

    private intervalId: any;
    showContent = false;

    @ViewChild(IonContent) content: IonContent;
    private shouldScrollToBottom = true;
    lastScrollTop: number = 0;
    lastScrollBottom: number = 0;
    showScrollDownIcon = false;

    constructor(
        private loadingService: LoadingService,
        private chatService: ChatService,
        private user: UserService,
        private socket: SocketService,
        private route: ActivatedRoute,
        private imageService: ImageService,
        private audioService: AudioService,
        private alertCtrl: AlertController,
        private router: Router,
        private toastService: ToastService,
        private platform: Platform,
        private alertService: AlertService,
        private insomnia: Insomnia,
        private zone: NgZone
    ) {
        this.initializeAppListeners();
    }

    ngOnInit(): void {
    }

    private initializeAppListeners() {
        if (!this.platform.is('cordova')) return;

        this.insomnia.keepAwake()
            .then(
                () => console.log('success'),
                () => console.log('error')
            );

        App.addListener('pause', () => {
            console.log('App is potentially going to background...');
            this.appIsInBackground = true;
            this.handleWebSocketConnectionOnPause();
        });

        App.addListener('resume', () => {
            console.log('App is back to foreground...');
            this.appIsInBackground = false;
            if (this.shouldReconnectWebSocket) {
                console.log('Reopening WebSocket connection...');
                this.ionViewWillEnter(); // Reabre a conexão WebSocket
                this.shouldReconnectWebSocket = false;
            }
        });

    }

    private handleWebSocketConnectionOnPause() {
        setTimeout(() => {
            if (this.appIsInBackground) {
                console.log('App is in background, closing WebSocket connection...');
                this.ionViewWillLeave(); // Realmente fecha a conexão
                this.shouldReconnectWebSocket = true;
            }
        }, 50000); // Aguarda 3 segundos para verificar se ainda está em background
    }

    async ionViewWillEnter() {
        this.loadingService.present();
        this.message = ''
        try {
            this.id = this.route.snapshot.params.id
            const chatdata: any = await this.chatService.open(this.id)
            this.current_balance = chatdata.sender.current_balance;
            this.currentChat = chatdata.receiver;
            this.messages = chatdata.messages;

            this.showContent = chatdata.sender.email === 'saladeencontrotesteloja@gmail.com' ? false : true;

            this.subscriptions = []
            this.sender = await this.user.get();

            this.chatService.set_chat(this.sender.id, this.id);

            this.socket.enter_chat(this.sender.id, this.id);
            this.subscriptions.push(this.socket.on_sending().subscribe(data => {
                this.zone.run(() => {

                    if (parseInt(data.sender_id) === this.sender.id) {
                        this.current_balance = data.sender_balance ? parseInt(data.sender_balance) : this.current_balance;
                    } else {
                        this.current_balance = data.receiver_balance ? parseInt(data.receiver_balance) : this.current_balance;
                    }
                })

                this.on_sending(data);
            }))
            this.subscriptions.push(this.socket.on_message().subscribe(data => {

                if (data.force_finalize_chat === true && data.message === null) {
                    this.touchAskToLeave('Sair da conversa?', data.message_to_show);
                }

                this.on_message(data);
            }))
            this.checkCurrentBalance();

            this.count_user_chat();

            this.loadingService.dismiss();
        } catch (error) {
            console.log(error)
            this.loadingService.dismiss();
        }

        this.content.scrollToBottom(0);
    }

    ngAfterViewInit() {
        this.content.getScrollElement().then((element) => {
            element.addEventListener('scroll', () => {
                const currentScrollDepth = element.scrollTop;
                const totalContentHeight = element.scrollHeight;
                const viewPortHeight = element.clientHeight;
                if (currentScrollDepth + viewPortHeight >= totalContentHeight - 10) {
                    this.showScrollDownIcon = false;
                } else {
                    this.showScrollDownIcon = true;
                }
            });
        });
    }

    /**
     * after view checked
     * @author Starley Cazorla
     */
    ngAfterViewChecked() {
        if (!this.showScrollDownIcon) {
            this.content.scrollToBottom(0);
        }
    }

    scrollToBottom() {
        this.showScrollDownIcon = false;
        this.content.scrollToBottom(0);
    }

    play() {
        this.player.play()
    }

    stop() {
        this.player.pause()
    }

    on_sending(data: SocketMessage) {
        if (parseInt(data.sender_id) != this.sender.id) {
            this.show_message = data.message_to_show
        }
    }

    on_message(data: ChatReceivedMessage) {
        this.messages.push(data.message)
        this.show_message = ''
    }

    is_sender(message: IChatMessage) {
        if (this.sender.id == message.sender_id)
            return 'sender-block'
        return 'receiver-block'
    }

    async touchSendMessage() {
        this.scrollToBottom();
        this.socket.send(null, this.sender.id, this.id, this.message);
        this.message = ''
        this.showEmojiPicker = false;
    }

    ionViewWillLeave() {
        this.socket.leave_chat(this.sender.id, this.id);
        this.chatService.close_and_notify(this.id);
        this.chatService.clear_chat();
        this.insomnia.allowSleepAgain();
        this.user.refresh();
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    isWrithing(event) {
        if (event.length == 0) {
            return this.socket.send(Actions.Cancelar, this.sender.id, this.id)
        }
        this.socket.send(Actions.Mensagem, this.sender.id, this.id);
    }

    touchNextLine() {
        this.message += '\n'
        console.log("🚀 ~ DialogPage ~ touchNextLine ~ this.message:", this.message);
    }


    handlerEmojiEvent(event) {
        this.message += event.data
    }

    /**
     * Touchs open camera
     * @author Starley Cazorla
     */
    async touchOpenCamera() {
        const alert = await this.alertCtrl.create({
            message: 'Escolha uma das opções:',
            buttons: [
                {
                    text: 'Galeria',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.openCameraOrGalery('galery');
                    }
                }, {
                    text: 'Camera',
                    handler: () => {
                        this.openCameraOrGalery('camera');
                    }
                }
            ]
        });

        await alert.present();

    }

    async openCameraOrGalery(type: string) {
        await this.imageService.getImage(type).then(async (resp: any) => {
            if (resp) {
                await this.chatService.send_attachment(this.sender.id, this.id, resp).then((resp: any) => {
                    console.log("🚀 ~ DialogPage ~ awaitthis.imageService.getImage ~ resp:", resp);
                }).catch(_err => {
                    console.log("🚀 ~ DialogPage ~ awaitthis.chatService.send_attachment ~ _err:", _err);
                    this.toastService.present('Falha ao enviar a mensagem! Tente novamente!');
                });
            }
        });
    }

    /**
     * Touchs record audio
     * @author Starley Cazorla
     * @param _event
     */
    async touchRecordAudio(_event: any) {
        this.audioService.startRecordAudio();
        this.socket.send(Actions.Audio, this.sender.id, this.id)
    }

    /**
     * Touchs stop record audio
     * @author Starley Cazorla
     * @param _event
     */
    async touchStopRecordAudio(_event: any) {
        this.socket.send(Actions.Cancelar, this.sender.id, this.id)
        await this.audioService.stopRecordAudio().then(async (resp: any) => {
            if (resp) {
                await this.chatService.send_audio(this.sender.id, this.id, resp).then((resp: any) => {
                    console.log("🚀 ~ DialogPage ~ awaitthis.imageService.getImage ~ resp:", resp);
                }).catch(err => {
                    this.toastService.present('Falha ao enviar a mensagem! Tente novamente!');
                    console.log("🚀 ~ DialogPage ~ awaitthis.imageService.getImage ~ err:", err);
                });
            }
        });
    }

    async touchAskToLeave(title?: string, message?: string) {
        const alert = await this.alertCtrl.create({
            header: title ? title : 'Sair da conversa?',
            message: message ? message : 'Tem certeza que deseja sair da conversa?',
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Sim',
                    handler: () => {
                        this.ionViewWillLeave();
                        this.router.navigate(['/main/chat/active']);
                    }
                }
            ]
        });

        await alert.present();
    }

    async checkCurrentBalance() {
        if (this.current_balance <= 5) {
            const alert = await this.alertCtrl.create({
                header: 'O seu saldo está esgotando!',
                message: `Restando apenas ${this.current_balance} minutos. Deseja adquirir mais minutos?`,
                buttons: [
                    {
                        text: 'Não',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                            console.log('Confirm Cancel: blah');
                        }
                    }, {
                        text: 'Sim',
                        handler: () => {
                            this.ionViewWillLeave();
                            this.router.navigate(['/main/payment/list']);
                        }
                    }
                ]
            });

            await alert.present();
        }
    }

    touchOpenVideoChat() {
        let message = 'O VÍDEO será liberado em breve, aguarde.'
        this.alertService.presentPopover(message);
    }


    count_user_chat() {
        this.intervalId = setInterval(() => {
            this.socket.update_user_time_chat(this.sender.id, this.id);
        }, 60 * 1000);
    }

    returnTextNextLine(text) {
        return text.replace(/\n/g, '<br>');
    }

}
// End of file dialog.page.ts
// Path: ./src/app/pages/chatService/dialog/dialog.page.ts
