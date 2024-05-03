export interface IUser{ 
    addressId: string,
    stateId: string,
    cityId: string,
    phone: string,
    name: string,
    birthday: string,
    preference_ids: number[],
    completed_register
    id
    created_at
    updated_at
    email
    is_blocked
    profile_id
    interest_id
    declare_yourself_id
    sex_id
    age_rule_accepted
    pedophilia_rule_accepted
    bullying_rule_accepted
    anonymous_rule_accepted
    use_therm_rule_accepted
    privacy_therm_rule_accepted
    current_balance
    spin_rollete
    profile_image
    profile_image_url
    created_at_formatted
    updated_at_formatted
    birthday_formatted
    current_balance_text
    complete_title_text
    pendent_invites_count
    waiting_answer_count
    active_chats_count
    online_status
    city
    state
    age
    show_preferences
    }

export interface IAccess{
    email
    password
    passwordRepeat?
}

export interface IBaseUser{
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    profile_id: number
}

