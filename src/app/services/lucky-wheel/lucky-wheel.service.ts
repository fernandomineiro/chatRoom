import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})

export class LuckyWheelService {
  private modelName: string = 'chat';

  constructor(private apiService: ApiService) {}

  awards() {
    return this.apiService.get(this.modelName, null, this.apiService.getHeaders());
  }

  spin() {
    return this.apiService.get(`${this.modelName}/try_spin_rollete`, null, this.apiService.getHeaders());
  }
}

// End of file lucky-wheel.service.ts
// Path: ./src/app/services/lucky-wheel/lucky-wheel.service.ts
