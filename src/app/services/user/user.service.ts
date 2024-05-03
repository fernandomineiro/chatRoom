import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { SocketService } from '../socket/socket.service';
import { Access, User } from './model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private modelName: string = 'users';
  private user: User
  constructor(
    private apiService: ApiService,
    private socket: SocketService
  ) { }

  create(userData: any) {
    return this.apiService.post(this.modelName, {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.passwordConfirmation,
      profile_id: 2, // 2 = Commom user
    });
  }

  update(user: User) {
    let addressAttribute = {
      id: user.addressId,
      state_id: user.stateId,
      city_id: user.cityId
    };
    const values = user.values()
    values.address_attributes = addressAttribute
    return this.apiService.put(this.modelName, values, this.apiService.getHeaders());
  }

  async refresh() {
    try {
      const data: any = await this.apiService.get(this.modelName, null, this.apiService.getHeaders()).toPromise();
      this.user = new User;
      this.user.setup(data)
      this.socket.start_user(this.user.id)
      this.user.stateId = data.address?.state_id;
      this.user.cityId = data.address?.city_id;
      for (let i = 0; i < data.preferences?.length; i++) {
        let preference = data.preferences[i]
        this.user.preference_ids.push(preference.id)
      }
      this.user.addressId = data.address?.id;
      return Promise.resolve(this.user)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  updateAccessData(data: Access) {
    return this.apiService.put(this.modelName, {
      email: data.email,
      password: data.password,
      password_confirmation: data.passwordRepeat
    }, this.apiService.getHeaders());
  }

  async get(): Promise<User> {
    if (this.user)
      return Promise.resolve(this.user)
    return this.refresh()
  }


  delete() {
    return this.apiService.put('users/delete_my_data', {}, this.apiService.getHeaders());
  }

  logout() {
    this.user = null
  }
}

// End of file user.service.ts
// Path: ./src/app/services/user/user.service.ts
