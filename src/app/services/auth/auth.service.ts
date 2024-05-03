import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private modelName: string;

  constructor(
    private apiService: ApiService,
    private user: UserService
  ) {
    this.modelName = 'auth';
  }

  login(email: string, password: string) {
    return this.apiService.post(`${this.modelName}/login`, {
      email: email,
      password: password
    });
  }

  passwordRecovery(email: string) {
    return this.apiService.post(`${this.modelName}/recover_pass`, {
      email: email
    });
  }

  logout() {
    localStorage.removeItem('token')
    this.user.logout()
  }
}

// End of file auth.service.ts
// Path: ./src/app/services/auth/auth.service.ts
