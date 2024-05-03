import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root'
})

export class CardService {
    private modelName: string = 'cards';

    constructor(private apiService: ApiService) { }

    create(userData: any) {
        return this.apiService.post(this.modelName, {
            card_banner_id: userData.value.cardBannerId,
            name: userData.value.name,
            number: userData.value.number.replace(/ /g, ''),
            validate_date_month: userData.value.month,
            validate_date_year: userData.value.year,
            ccv_code: userData.value.securityCode,
            cpf: userData.value.cpf.replace(/\D+/g, ''),
        }, this.apiService.getHeaders());
    }

    update(userData: any) {
        return this.apiService.put(this.modelName, {
            card_banner_id: userData.cardBannerId,
            name: userData.name,
            number: userData.number.replace(/ /g, ''),
            validate_date_month: userData.month,
            validate_date_year: userData.year,
            ccv_code: userData.ccvCode,
            cpf: userData.value.cpf.replace(/\D+/g, ''),
        }, this.apiService.getHeaders());
    }

    all() {
        return this.apiService.get(this.modelName, null, this.apiService.getHeaders());
    }

    get(cardId: number) {
        return this.apiService.get(`${this.modelName}/${cardId}`, null, this.apiService.getHeaders());
    }

    delete(cardId: number) {
        return this.apiService.delete(`${this.modelName}/${cardId}`, this.apiService.getHeaders());
    }
}

// End of file card.service.ts
// Path: ./src/app/services/card/card.service.ts
