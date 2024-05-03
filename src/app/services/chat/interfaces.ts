import { IUser } from "../user/interfaces"

export interface ChatResponse {
    status: string,
    button_text: string,
    invite_chats: IInviteChat[]
}

export interface ISearchChat {
    page: number
    state_id?: number
    city_id?: number
    initial_age?: number
    final_age?: number
    interest_id?: number
    declare_yourself_id?: number
    preferences?: number[]
}

interface IChat {
    id: number,
    created_at: string,
    updated_at: string,
    message: string,
    sender: IUser,
    receiver: IUser,
    sender_id: number,
    receiver_id: number,
    answer_date: string,
    invite_chat_status_id: number,
    invite_chat_status: { id: number, name: string }
    created_at_formatted
}

export interface IInviteChat {
    user_data: IUser,
    invite_chat: IChat
    receiver_id: number
}
export interface Invited {
    icon_url: string
    invite_chat: IChat
    invite_chat_id: number
    link: string
    message: string
    new_invite: boolean
    receiver_id: string
}

export interface Declined {
    invite_chat: IChat
    message: string
    new_decline: boolean
}

export interface Accepted {
    new_accept_invite: boolean,
    invite_chat: IChat,
    message: string
}

export interface Opened {
    open_old_chat: boolean,
    sender_id: number,
    receiver_id: number,
    message: string,
    icon_url: string,
    link: string
}

export interface IChatMessage {
    id: number,
    created_at: string,
    updated_at: string,
    content?: string,
    sender_id: number,
    receiver_id: number,
    sender: IUser,
    receiver: IUser,
    link: boolean,
    audio_url?: string,
    attachment_url?: string,
    created_at_formatted: string,
    updated_at_formatted: string,
    created_at_formatted_hour: string,
    room_name?: string
}

export interface ChatReceivedMessage{
    force_finalize_chat: boolean
    message_to_show: string
    show_new_message: true
    receiver_id: string
    title: string
    icon_url: string
    link: string
    message: IChatMessage
  }

export interface SocketMessage{
    message?: string
    message_to_show: string
    finalize_chat: boolean
    sender_id: string
    receiver_id: string
    sender_balance: string
    receiver_balance: string
    id_user_to_act: string
    balance_to_update: string
    writing: boolean
    recording: boolean
  }
