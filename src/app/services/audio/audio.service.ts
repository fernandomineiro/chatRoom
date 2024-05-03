import { Injectable } from '@angular/core';
import { NativeAudio } from '@capgo/native-audio';
import { Platform } from '@ionic/angular';
import { VoiceRecorder } from 'capacitor-voice-recorder';


@Injectable({
    providedIn: 'root'
})
export class AudioService {

    public notifySond: HTMLAudioElement;

    constructor(private platform: Platform) {
        this.notifySond = new Audio('../../../assets/sounds/convite.ogg');

        NativeAudio.preload({
            assetId: "fire",
            assetPath: "assets/sounds/convite.mp3",
            audioChannelNum: 1,
            isUrl: false,
        });
    }

    async canRecordVoice() {
        await VoiceRecorder.canDeviceVoiceRecord().then(res => {
            if (res) {
                this.requsetPermission();
            }
        }
        )
    }

    async requsetPermission() {
        await VoiceRecorder.requestAudioRecordingPermission().then(res => {
            console.log("🚀 ~ AudioService ~ VoiceRecorder.requestAudioRecordingPermission ~ res:", res);
        });
    }

    async getRecordStatus() {
        await VoiceRecorder.getCurrentStatus().then(res => {
            console.log("🚀 ~ AudioService ~ VoiceRecorder.isRecording ~ res:", res);
        });
    }

    async startRecordAudio() {
        await this.canRecordVoice();
        await VoiceRecorder.startRecording();
    }

    async stopRecordAudio(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                await VoiceRecorder.stopRecording().then(async (restult: any) => {
                    if (restult.value && restult.value.recordDataBase64) {
                        resolve(restult.value.recordDataBase64);
                    } else {
                        resolve(null);
                    }
                });
            } catch (err) {
                reject(err)
            }
        });
    }

    public notificationSound() {

        if (this.platform.is('ios')) {
            NativeAudio.play({
                assetId: 'fire',
                time: 1000
            });
            setTimeout(() => {
                NativeAudio.stop({ assetId: 'fire' }); // Pause the sound
            }, 2000); // Stop after 3 seconds
        } else {

            this.notifySond.play().then(() => {
                setTimeout(() => {
                    this.notifySond.pause(); // Pause the sound
                    this.notifySond.currentTime = 0; // Rewind to the start
                }, 2000); // Stop after 3 seconds
            }).catch(err => console.error("Error playing sound:", err));
        }
    }


}
