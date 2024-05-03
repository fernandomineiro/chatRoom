import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

/**
 * @author Arthur Duarte <arthur.duarte@harmis.com.br>
 * @version 1.0.0
 * @see https://ionicframework.com/docs/api/toast
 */
export class ToastService
{
  constructor(private toastController: ToastController) {}


  async present(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });

    toast.present();
  }
}

/* End of file toast.service.ts */
/* Path: ./src/app/services/toast/toast.service.ts */
