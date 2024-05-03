import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    constructor() { }

    /**
     * Gets image
     * @author Starley Cazorla
     * @param type
     */
    async getImage(type: string): Promise<any> {

        return new Promise((resolve, reject) => {

            try {
                Camera.getPhoto({
                    quality: 80,
                    resultType: CameraResultType.DataUrl,
                    source: type == 'camera' ? CameraSource.Camera : CameraSource.Photos
                }).then((resp: any) => {

                    if (!resp.dataUrl)
                        reject(null)

                    resolve(resp.dataUrl)
                })
            } catch (err) {
                console.error(err);
                reject(null)
            }


        })
    }

}
