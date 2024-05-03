export interface IForm{
    setup(data)
    is_valid(): boolean
    errors(): string[]
}

export interface IValidation{
    add_message(message: string)
    is_valid()
    clear()
    get_messages()
}

export class Form implements IForm{

    protected __validations: Validation[] = []

    get_validation(name) {
        let validation = this.__validations[name]
        if (validation === undefined) {
            validation = new Validation
            this.__validations[name] = validation
        }
        return validation
    }

    add_validation(name) {
        let validation = new Validation
        this.__validations[name] = validation
    }

    is_valid(): boolean {
        let valid: boolean = true
        for (let validation in this.__validations) {
            valid = valid && this.__validations[validation].is_valid()
        }
        return valid
    }

    errors(): string[] {
        let errors: string[] = []
        for (let validation in this.__validations) {
            errors = errors.concat(this.__validations[validation].get_messages())
        }
        return errors
    }

    setup(data) {
        for (let key in data) {
            this[key] = data[key]
        }
    }

    values() {
        return JSON.parse(JSON.stringify(this))
    }
}


export class Validation implements IValidation{
    private errors: string[] = [];

    add_message(message: string) {
        this.errors.push(message)
    }

    is_valid() {
        return this.errors.length === 0
    }

    clear() {
        this.errors = []
    }

    get_messages() {
        return this.errors
    }
}

