import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})

export class SupportContactService {
  private modelName: string = 'support_contacts';

  constructor(private apiService: ApiService) {}

  create(userData: any) {
    return this.apiService.post(this.modelName, {
      support_contact_subject_id: userData.get('subjectId').value,
      name: userData.get('name').value,
      email: userData.get('email').value,
      phone: userData.get('phone').value,
      message: userData.get('message').value
    });
  }
}

// End of file support-contact.service.ts
// Path: ./src/app/services/support-contacts/support-contact.service.ts
