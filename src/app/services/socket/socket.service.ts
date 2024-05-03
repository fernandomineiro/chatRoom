import { EventEmitter, Injectable } from "@angular/core";
import actioncable from "actioncable";
import { environment } from "src/environments/environment";
import { AudioService } from "../audio/audio.service";
import { Accepted, ChatReceivedMessage, Declined, Invited, Opened, SocketMessage } from "../chat/interfaces";

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private consumer: ActionCable.Cable
    private channel: ActionCable.Channel[]
    private user_channel: ActionCable.Channel
    private _on_invite: EventEmitter<Invited>
    private _on_reject: EventEmitter<Declined>
    private _on_accept: EventEmitter<Accepted>
    private _on_open: EventEmitter<Opened>
    private _on_sending: EventEmitter<SocketMessage>
    private _on_message: EventEmitter<ChatReceivedMessage>
    private channel_intervals: any[]
    constructor(private audioService: AudioService) {
        this._on_accept = new EventEmitter
        this._on_reject = new EventEmitter
        this._on_invite = new EventEmitter
        this._on_open = new EventEmitter
        this._on_sending = new EventEmitter
        this._on_message = new EventEmitter
        this.consumer = actioncable.createConsumer(environment.SOCKET_URL)
        this.channel = []
        this.channel_intervals = []
    }

    start_user(id) {
        this.user_channel = this.consumer.subscriptions.create({
            channel: 'ConnectChannel',
            current_user_id: id,
        },
            {
                received: (message: any) => {
                    if (message.message === null)
                        return;
                    if (message.new_invite) {
                        this.audioService.notificationSound();
                        return this._on_invite.emit(message)
                    }
                    if (message.new_decline) {
                        return this._on_reject.emit(message)
                    }
                    if (message.new_accept_invite) {
                        return this._on_accept.emit(message)
                    }
                    if (message.open_old_chat) {
                        return this._on_open.emit(message)
                    }
                },
            },)

    }

    on_invite() {
        return this._on_invite
    }

    on_accept() {
        return this._on_accept
    }

    on_reject() {
        return this._on_reject
    }

    on_open() {
        return this._on_open
    }

    on_sending() {
        return this._on_sending
    }

    on_message() {
        return this._on_message
    }

    leave_chat(sender_id, receiver_id) {
        const channel_id = sender_id + receiver_id + ''
        if (!this.channel[channel_id]) {
            console.error('Canal invalido', channel_id)
            return
        }
        this.channel[channel_id].unsubscribe()
    }

    enter_chat(sender_id, receiver_id) {
        const channel_id = sender_id + receiver_id + ''
        this.channel[channel_id] = this.consumer.subscriptions.create({
            channel: "RoomChannel", first_id: sender_id, last_id: receiver_id, current_user_id: sender_id
        },
            {
                received: (message: any) => {
                    if (message.recording || message.writing || message.message_to_show?.length == 0) {
                        return this._on_sending.emit(message)
                    }
                    if ((message?.message?.attachment_url != null || message?.message?.audio_url != null) || message.message_to_show) {
                        return this._on_message.emit(message)
                    }
                },
            })

        this.channel_intervals[channel_id] = setInterval(() => {
            if (!this.channel[channel_id]) {
                return clearInterval(this.channel_intervals[channel_id])
            }
            this.user_channel.perform('check_online_socket', {
                "receiver_id": receiver_id,
                "sender_id": sender_id,
                "finalize_chat": false,
                "check_online": true,
                "spin_rollete": false
            })
        }, 60 * 1000)
    }

    update_user_time_chat(sender_id, receiver_id) {
        const channel_id = sender_id + receiver_id + '';
        this.channel[channel_id].perform('speak', {
            count: 1,
            id_user_to_act: sender_id,
            sender_id: sender_id,
            receiver_id: receiver_id,
        });
    }

    send(action: Actions, user_id: number, receiver_id: number, message = null) {
        const channel_id = user_id + receiver_id + ""
        if (!this.channel[channel_id]) {
            console.error('Canal invalido', channel_id)
            return
        }
        const recording = action === Actions.Audio
        const writing = action === Actions.Mensagem
        this.channel[channel_id].perform('speak', {
            "count": null,
            "message": message,
            "receiver_id": receiver_id,
            "sender_id": user_id,
            "first_id": receiver_id,
            "last_id": user_id,
            "id_user_to_act": receiver_id,
            "writing": writing,
            "recording": recording,
        })
        //   this.channel[trip_id].send({
        //     action_id: action_id,
        //     trip_id: trip_id,
        //     sender_id: sender_id
        // })

    }

    // "RoomChannel", { trip_id: 10 })
}



export enum Actions {
    Mensagem = "1",
    Audio = "2",
    Cancelar = "3"
}
