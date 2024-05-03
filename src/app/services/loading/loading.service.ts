import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

/**
 * @author Arthur Duarte <arthur.duarte@harmis.com.br>
 * @version 1.0.0
 * @see https://ionicframework.com/docs/api/loading
 * @see https://stackoverflow.com/questions/52574448/ionic-4-loading-controller-dismiss-is-called-before-present-which-will-ke
 */
export class LoadingService {
    isLoading = false;

    constructor(private loadingController: LoadingController) { }

    async present(message: string = 'Aguarde um instante...') {
        this.dismiss();

        this.isLoading = true;
        return await this.loadingController.create({
            // cssClass: 'my-custom-class',
            message: message,
            duration: 60000,
        }).then(a => {
            a.present().then(() => {
                if (!this.isLoading) {
                    a.dismiss().then(() => { });
                }
            });
        });
    }

    async dismiss() {
        this.isLoading = false;
        return await this.loadingController.dismiss().then(() => { });
    }
}

/* End of file loading.service.ts */
/* Path: ./src/app/services/loading/loading.service.ts */
