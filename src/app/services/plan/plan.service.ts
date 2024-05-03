import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})

export class PlanService {
  private modelName: string = 'orders';

  constructor(private apiService: ApiService) {}

  buy(planId: number, cardId: number) {
    return this.apiService.post(`${this.modelName}/buy_plan`, {
      plan_id: planId,
      card_id: cardId
    }, this.apiService.getHeaders());
  }

  buyWithCard(planId: number, cardData: any) {
    const cardAttributes = {
      card_banner_id: cardData.value.cardBannerId,
      name: cardData.value.cardName,
      number: cardData.value.cardNumber,
      validate_date_month: cardData.value.month,
      validate_date_year: cardData.value.year,
      ccv_code: cardData.value.code
    }

    return this.apiService.post(`${this.modelName}/buy_plan`, {
      plan_id: planId,
      card_attributes: cardAttributes
    }, this.apiService.getHeaders());
  }

  orders() {
    return this.apiService.get(this.modelName, null, this.apiService.getHeaders());
  }
}

// End of file plan.service.ts
// Path: ./src/app/services/plan/plan.service.ts
