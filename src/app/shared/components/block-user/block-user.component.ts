import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatService, ToastService } from 'src/app/services';

@Component({
    selector: 'app-block-user',
    templateUrl: './block-user.component.html',
    styleUrls: ['./block-user.component.scss'],
})
export class BlockUserComponent implements OnInit {

    @Input() user: any;

    motivos = ["Comportamento abusivo",
        "Spam",
        "Violação dos termos de uso",
        "Assédio",
        "Atividade maliciosa",
        "Outros"]

    motivoSelecionado: string = '';

    constructor(private chatService: ChatService,
        private toastService: ToastService,
        private modalCtrl: ModalController) { }

    ngOnInit() { }

    touchBlockUser() {
        this.chatService.blockUser(this.user.id).then((resp: any) => {
            console.log("🚀 ~ HomePage ~ this.chatService.blockUser ~ resp:", resp);
            if (resp.status === 'success') {
                this.toastService.present(resp.message);
                this.touchBack('block_user');
            } else {
                this.toastService.present(resp.message);
            }
        })
    }

    touchBack(data?: any) {
        this.modalCtrl.dismiss(data);
    }
}
