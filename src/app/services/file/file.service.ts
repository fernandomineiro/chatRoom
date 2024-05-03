import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';


@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor() { }

    /**
     * Writes file
     * @author Starley Cazorla
     * @param pathFile
     * @param fileData
     */
    async writeFile(pathFile: string, fileData: any) {
        await Filesystem.writeFile({
            path: pathFile,
            data: fileData,
            directory: Directory.Documents,
            recursive: true
        }).then((res) => {
            console.log("🚀 ~ FileService ~ writeFile ~ res:", res);

        });
    }

    /**
     * Reads file
     * @author Starley Cazorla
     * @param filename
     * @returns
     */
    async readFile(filename: string) {
        const file: any = await Filesystem.readFile({
            path: filename,
            directory: Directory.Documents
        });

        // Convert the base64 encoded data to blob if necessary
        const blob = await this.base64ToBlob(file.data, 'audio/aac');

        return blob;
    }

    /**
     * Deletes file
     * @author Starley Cazorla
     * @param filename
     */
    async deleteFile(filename: string) {
        Filesystem.deleteFile({
            path: filename,
            directory: Directory.Documents
        });
    }

    async base64ToBlob(base64: string, contentType: string) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    }

}
