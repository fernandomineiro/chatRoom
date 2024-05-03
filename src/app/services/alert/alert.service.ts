import { Injectable } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/shared/components/popover-component/popover-component';

@Injectable({
    providedIn: 'root'
})

/**
 * @author Arthur Duarte <arthur.duarte@harmis.com.br>
 * @version 1.0.0
 * @see https://ionicframework.com/docs/api/alert
 */
export class AlertService {
    constructor(private alertController: AlertController,
        private popoverController: PopoverController) { }

    async present(message: string, title: string = 'Atenção!') {
        const alert = await this.alertController.create({
            header: title,
            message: message,
            buttons: ['OK']
        });

        await alert.present();
    }

    async presentConfirm(customFunc: any, options?: object) {

        let defaults = {
            title: 'Você tem certeza?',
            message: '',
            agree: 'Sim',
            disagree: 'Não'
        }

        if (options)
            for (let i in options) defaults[i] = options[i]

        const confirm = await this.alertController.create({
            header: defaults.title,
            message: defaults.message,
            buttons: [
                {
                    text: defaults.agree,
                    handler: () => {
                        customFunc()
                    }
                },
                {
                    text: defaults.disagree,
                    handler: () => { }
                }
            ]
        });

        await confirm.present();
    }

    async presentPopover(message: string, scss?: string) {
        const popover = await this.popoverController.create({
            component: PopoverComponent,
            translucent: true,
            cssClass: scss,
            componentProps: {
                message: message
            }
        });
        return await popover.present();
    }
}

/* End of file alert.service.ts */
/* Path: ./src/app/services/alert/alert.service.ts */
