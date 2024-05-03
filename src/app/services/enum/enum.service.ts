import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})

/**
 * @author Arthur Duarte <arthur.duarte@harmis.com.br>
 * @version 1.2.0
 */
export class EnumService
{
  constructor(private apiService: ApiService) {}

  loadDefaults() {
    this.setDefaultLoadStates();
    this.setDefaultInterests();
    this.setDefaultYourSelfDeclarations();
    this.setDefaultPreferences();
    this.setDefaultAges();
    this.setDefaultCardBrands();
    this.setDefaultGenders();
  }

  getDefault(key) {
    let data = localStorage.getItem(key);
    return JSON.parse(data);
  }

  cardBrands() {
    return this.apiService.get('card_banners');
  }

  cardBrand(cardBrandId: number) {
    return this.apiService.get(`card_banners/${cardBrandId}`);
  }

  address(postalCode: any) {
    return this.apiService.get('cep/get_address_by_cep', {
        cep: postalCode
    });
  }

  countries() {
    return this.apiService.get('countries');
  }

  country(countryId: number) {
    return this.apiService.get(`countries/${countryId}`);
  }

  states() {
    return this.apiService.get('states');
  }

  state(stateId: number) {
    return this.apiService.get(`states/${stateId}`);
  }

  cities() {
    return this.apiService.get('cities');
  }

  citiesState(stateId: number) {
    return this.apiService.get(`cities/by_state/${stateId}`);
  }

  city(cityId: number) {
    return this.apiService.get(`cities/${cityId}`);
  }

  profiles() {
    return this.apiService.get('profiles');
  }

  profile(profileId: number) {
    return this.apiService.get(`profiles/${profileId}`);
  }

  genders() {
    return this.apiService.get('sexes');
  }

  gender(genderId: number) {
    return this.apiService.get(`sexes/${genderId}`);
  }

  interests() {
    return this.apiService.get('interests');
  }

  interest(interestId: number) {
    return this.apiService.get(`interests/${interestId}`);
  }

  preferences() {
    return this.apiService.get('preferences');
  }

  preference(preferenceId: number) {
    return this.apiService.get(`preferences/${preferenceId}`);
  }

  plans() {
    return this.apiService.get('plans');
  }

  plan(planId: number) {
    return this.apiService.get(`plans/${planId}`);
  }

  tutorialTypes() {
    return this.apiService.get('tutorial_types', {
      tutorial_type_id: 1 // 1 = App
    });
  }

  tutorialType(tutorialType: number) {
    return this.apiService.get(`tutorial_types/${tutorialType}`);
  }

  tutorials() {
    return this.apiService.get('tutorials', {
      tutorial_type_id: 1
    });
  }

  tutorial(tutorialId: number) {
    return this.apiService.get(`tutorials/${tutorialId}`);
  }

  selfDeclarations() {
    return this.apiService.get('declare_yourselfs');
  }

  selfDeclaration(selfDeclarationId: number) {
    return this.apiService.get(`declare_yourselfs/${selfDeclarationId}`);
  }

  settings() {
    return this.apiService.get('system_configurations');
  }

  contactSubjects() {
    return this.apiService.get('support_contact_subjects');
  }

  private setDefaultLoadStates() {
    this.states().subscribe((resp: any) => {
      localStorage.setItem('states', JSON.stringify(resp));
    });
  }

  private setDefaultInterests() {
    this.interests().subscribe((resp: any) => {
      localStorage.setItem('interests', JSON.stringify(resp));
    });
  }

  private setDefaultYourSelfDeclarations() {
    this.selfDeclarations().subscribe((resp: any) => {
      localStorage.setItem('selfDeclarations', JSON.stringify(resp));
    });
  }

  private setDefaultPreferences() {
    this.preferences().subscribe((resp: any) => {
      localStorage.setItem('preferences', JSON.stringify(resp));
    });
  }

  private setDefaultAges() {
    let ages = [];

    for (let i = 18; i <= 81; i++) {
      ages.push(i);
    }

    localStorage.setItem('ages', JSON.stringify(ages));
  }

  private setDefaultCardBrands() {
    this.cardBrands().subscribe((resp: any) => {
      localStorage.setItem('cardBrands', JSON.stringify(resp));
    });
  }

  private setDefaultGenders() {
    this.genders().subscribe((resp: any) => {
      localStorage.setItem('genders', JSON.stringify(resp));
    });
  }
}

// End of file enum.service.ts
// Path: ./src/app/services/enum/enum.service.ts
