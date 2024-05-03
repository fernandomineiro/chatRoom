import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

/**
 * @author Starley Cazorla
 * Classe responsavel por validar o uso do backbutton no sistema
 */
@Injectable()
export class NavigationService {
    novaAcao = 0

    private backbuttonSubscription: Subscription;

    constructor(private router: Router,
        private platform: Platform,
        private modalCtrl: ModalController) {

    }

    ngOnDestroy() {
        this.backbuttonSubscription.unsubscribe();
    }

    /**
     * Usado quando se clica no botão voltar!
     */
    public async navigateToPreviousPage() {

        console.log('Rota solicitante ->>', this.router.url);
        const url = this.router.url;
        const modal = await this.modalCtrl.getTop();
        if (url.match('/chat/dialog')) {
            // tslint:disable-next-line: only-arrow-functions
            document.addEventListener('backbutton', function (event) {
                event.preventDefault();
                event.stopPropagation();
                console.log('DesabilitaBotãoVoltar');
            }, false);
        } else if (!url.match('/login') || !url.match('/home') || !url.match('/conexao') || !url.match('/pedido')) {
            if (modal) {
                modal.dismiss();
            } else {
                this.platform.backButton.observers.pop();
            }
        }
    }


}
