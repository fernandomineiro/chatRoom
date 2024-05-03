import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService, EnumService, LoadingService } from '../../../../../services/index';
import { ISearchChat } from 'src/app/services/chat/interfaces';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})

export class FormPage implements OnInit {
  states = [];
  cities = [];
  ages = [];
  interests = [];
  selfDeclarations = [];
  preferences = [];
  data: ISearchChat
  preferenceId = [];

  constructor(
    private enumService: EnumService,
    private loadingService: LoadingService,
    private chat: ChatService,
    private router: Router
  ) {
    // this.formData = this.formBuilder.group({
    //   stateId: [''],
    //   cityId: [''],
    //   interestId: [''],
    //   selfDeclarationId: [''],
    //   preferences: this.formBuilder.array([]),
    //   initialAge: [''],
    //   finalAge: ['']
    // });
  }

  ngOnInit() {
    this.data = {
      page: 1
    }
    this.states = this.enumService.getDefault('states');
    this.interests = this.enumService.getDefault('interests');
    this.ages = this.enumService.getDefault('ages');
    this.selfDeclarations = this.enumService.getDefault('selfDeclarations');
    this.preferences = this.enumService.getDefault('preferences');
  }

  loadCities(event: any) {
    let stateId
    if(typeof event === 'number' || typeof event === 'string')
      stateId = event
    else
      stateId = event.detail.value
    this.data.city_id = null;
    this.loadingService.present('Carregando cidades...');
    this.enumService.citiesState(stateId).subscribe((resp: any) => {
      this.loadingService.dismiss();
      this.cities = resp;
    }, err => {
      console.error(err);
      this.loadingService.dismiss();
    })
  }

  select_city(id) {
    this.data.city_id = id
  }

  // onCheckboxChange(e) {
  //   const preferences: FormArray = this.formData.get('preferences') as FormArray;

  //   if (e.target.checked) {
  //     preferences.push(new FormControl(e.target.value));
  //   } else {
  //     const index = preferences.controls.findIndex(x => x.value === e.target.value);
  //     preferences.removeAt(index);
  //   }

  //   if (preferences.controls.length > 3) {
  //     this.toastService.present('Escolha somente 3 preferências.');
  //     e.target.checked = false;
  //     return;
  //   }
  // }

  preferences_changed(data) {
    console.log(data)
    this.data.preferences = data
  }

  search() {
    // const preferences: FormArray = this.formData.get('preferences') as FormArray;

    // let preferenceIds: any = [];

    // for (let control of preferences.controls) {
    //   preferenceIds.push(control.value);
    // }

    // preferenceIds = preferenceIds.length > 0 ? preferenceIds.join() : '';
    this.chat.set_params(this.data)
    this.router.navigate(['/main/chat/search/result']);
  }
}

// End of file form.page.ts
// Path: ./src/app/pages/chat/search/form/form.page.ts
