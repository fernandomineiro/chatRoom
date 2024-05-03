import { Form } from "src/app/shared/model/base";
import { IAccess, IUser } from "./interfaces";

export class User extends Form implements IUser{
    addressId: string
    stateId: string
    cityId: string
    phone: string
    name: string
    birthday: string
    preference_ids: number[]

    image: string

    completed_register: boolean
    id: number
    created_at: string
    updated_at: string
    email: string
    is_blocked: boolean
    profile_id: number
    interest_id: number
    declare_yourself_id: number
    sex_id: number
    age_rule_accepted: boolean
    pedophilia_rule_accepted: boolean
    bullying_rule_accepted: boolean
    anonymous_rule_accepted: boolean
    use_therm_rule_accepted: boolean
    privacy_therm_rule_accepted: boolean
    current_balance: number
    spin_rollete: boolean
    profile_image: string
    profile_image_url: string
    created_at_formatted: string
    updated_at_formatted: string
    birthday_formatted: string
    current_balance_text: string
    complete_title_text: string
    pendent_invites_count: number
    waiting_answer_count: number
    active_chats_count: number
    online_status: boolean
    address: {
        id: number,
        complete_address: string,
        address: string,
        number: string,
        complement: string,
        district: string,
        city_id: number,
        city_name: string,
        state_id: number,
        state_name: string,
        zipcode: string
    }
    city: any;
    state: any;
    age: any;
    show_preferences: any;
    constructor() {
        super()
        this.addressId = ''
        this.preference_ids = []
        this.phone = ''
        this.stateId = ''
        this.cityId = ''
        this.name = ''
        this.birthday = ''
        this.age_rule_accepted = false
        this.pedophilia_rule_accepted = false
        this.bullying_rule_accepted = false
        this.anonymous_rule_accepted = false
        this.use_therm_rule_accepted = false
        this.privacy_therm_rule_accepted = false
        this.completed_register = false
    }

    validate_name() {
        const v = this.get_validation('name')
        v.clear()
        if (this.name.length === 0)
            v.add_message('O nome é obrigatorio')
    }

    validate_preferences() {
        const v = this.get_validation('preferences')
        v.clear()
        if (this.preference_ids.length === 0)
            v.add_message('Selecione as suas preferencias')
        if (this.preference_ids.length > 3)
            v.add_message('Limite de preferencias atingido')
    }

    validate_terms() {
        const v = this.get_validation('terms')
        v.clear()
        if (!this.age_rule_accepted || !this.pedophilia_rule_accepted || !this.bullying_rule_accepted || !this.anonymous_rule_accepted ||
            !this.use_therm_rule_accepted || !this.privacy_therm_rule_accepted)
            v.add_message('É necessário aceitar todos os termos de uso e privacidade')
    }

    validate_address() {
        const v = this.get_validation('address')
        v.clear()
        if (!this.cityId || !this.stateId)
            v.add_message('Selecione seu estado e cidade')
    }

    is_valid() {
        this.validate_name()
        this.validate_preferences()
        this.validate_terms()
        this.validate_address()
        return super.is_valid()
    }

    values() {
        return {
            name: this.name,
            profile_image: this.profile_image,
            phone: this.phone,
            birthday: this.birthday,
            sex_id: this.sex_id,
            interest_id: this.interest_id,
            declare_yourself_id: this.declare_yourself_id,
            preference_ids: this.preference_ids,
            age_rule_accepted: this.age_rule_accepted ,
            pedophilia_rule_accepted: this.pedophilia_rule_accepted ,
            bullying_rule_accepted: this.bullying_rule_accepted ,
            anonymous_rule_accepted: this.anonymous_rule_accepted ,
            use_therm_rule_accepted: this.use_therm_rule_accepted ,
            privacy_therm_rule_accepted: this.privacy_therm_rule_accepted,
            address_attributes: null
        }
    }

}


export class Access extends Form implements IAccess{
    email: string
    password: string
    passwordRepeat?: string

    constructor() {
        super()
        this.email = ''
        this.password = ''
        this.passwordRepeat = ''
    }

    validate_password() {
        const v = this.get_validation('name')
        v.clear()
        if (this.password !== this.passwordRepeat)
            v.add_message('As senhas estão diferentes')
    }

    is_valid() {
        this.validate_password()
        return super.is_valid()
    }
}
