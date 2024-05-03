import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ISearchChat } from './interfaces';

@Injectable({
    providedIn: 'root'
})

/**
 * @author Arthur Duarte <arthur.duarte@harmis.com.br>
 * @version 1.1.0
 */
export class ChatService {
    private modelName: string = 'chat';
    info: any
    private _current_chat: string
    private search_params: ISearchChat
    constructor(
        private apiService: ApiService
    ) {
        this.info = undefined
    }

    set_params(data: ISearchChat) {
        this.search_params = data
    }

    clear_chat() {
        this._current_chat = null
    }

    set_chat(sender: number, receiver: number) {
        if (sender - 0 > receiver - 0) {
            this._current_chat = sender + '_' + receiver
            return
        }
        this._current_chat = receiver + '_' + sender
    }

    current_chat(sender: number, receiver: number) {
        if (!this._current_chat)
            return false
        const current = this._current_chat.split('_')
        if (sender - 0 > receiver - 0)
            return parseInt(current[0]) == sender && parseInt(current[1]) == receiver
        return parseInt(current[0]) == receiver && parseInt(current[1]) == sender
    }

    sample() {
        return this.apiService.get(`${this.modelName}/initial_page`, {
            page: 1
        }, this.apiService.getHeaders());
    }

    search(page) {
        this.search_params.page = page
        const params = JSON.parse(JSON.stringify(this.search_params))
        params.preferences = this.search_params.preferences?.join()
        return this.apiService.get(`${this.modelName}/find_chat`, params, this.apiService.getHeaders());
    }

    active(page = 1) {
        return this.apiService.get(`${this.modelName}/active_chats`, {
            page: page
        }, this.apiService.getHeaders());
    }

    waiting() {
        return this.apiService.get(`${this.modelName}/waiting_answer`, {
            page: 1
        }, this.apiService.getHeaders());
    }

    pending() {
        return this.apiService.get(`${this.modelName}/pendent_invites`, {
            page: 1
        }, this.apiService.getHeaders());
    }

    invite(receiverId: number, message: string) {
        return this.apiService.post(`${this.modelName}/invite_chat`, {
            sender_id: localStorage.getItem('id'),
            receiver_id: receiverId,
            message: message
        }, this.apiService.getHeaders());
    }

    acceptInvite(chatId: number) {
        return this.apiService.post(`${this.modelName}/accept_invite`, {
            id: chatId
        }, this.apiService.getHeaders());
    }

    declineInvite(chatId: number) {
        return this.apiService.post(`${this.modelName}/decline_invite`, {
            id: chatId
        }, this.apiService.getHeaders());
    }

    open(chatId: number) {
        return this.apiService.get(`${this.modelName}/open_old_chat/${chatId}`, null, this.apiService.getHeaders()).toPromise();
    }

    /**
     * Sends attachment
     * @author Starley Cazorla
     * @param senderId
     * @param receiver_id
     * @param attachment
     * @param [type]
     * @returns
     */
    async send_attachment(senderId: any, receiver_id: any, attachment: any) {
        let body = {
            sender_id: parseInt(senderId),
            receiver_id: parseInt(receiver_id),
            message: {
                "attachment": attachment
            }
        }
        return await this.apiService.post(`${this.modelName}/send_attachment`, body, this.apiService.getHeaders()).toPromise();
    }

    async close_and_notify(receiver_id: any) {
        let body = {
            receiver_id: parseInt(receiver_id)
        }
        return await this.apiService.post(`${this.modelName}/close_chat_and_notify`, body, this.apiService.getHeaders()).toPromise();
    }

    /**
     * Sends audio
     * @author Starley Cazorla
     * @param senderId
     * @param receiver_id
     * @param attachment
     * @returns
     */
    async send_audio(senderId: any, receiver_id: any, attachment: any) {
        let body = {
            sender_id: parseInt(senderId),
            receiver_id: parseInt(receiver_id),
            mediaBlob: "data:audio/mp3;base64," + attachment
        }
        console.log("🚀 ~ ChatService ~ send_audio ~ body:", body);
        let resultApi = await this.apiService.post(`${this.modelName}/send_audio`, body, this.apiService.getHeaders()).toPromise();
        return resultApi
    }

    /**
     * Blocks user
     * @author Starley Cazorla
     * @param receiver_id
     * @returns
     */
    async blockUser(receiver_id: any) {
        let body = {
            receiver_id: parseInt(receiver_id)
        }
        return await this.apiService.post(`${this.modelName}/block_user`, body, this.apiService.getHeaders()).toPromise();
    }
}

// End of file chat.service.ts
// Path: ./src/app/services/chat/chat.service.ts
