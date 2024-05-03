import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ImageService } from 'src/app/services/image/image.service';
import { User } from 'src/app/services/user/model';
import { AlertService, EnumService, LoadingService, ToastService, UserService } from '../../../services/index';
import { SelectComponent } from '../popover-select/select/select.component';

@Component({
    selector: 'user-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit {
    @Input() button = 'Atualizar dados'
    @Input() user: User
    @Output() on_save: EventEmitter<any> = new EventEmitter();
    selfDeclarations = [];
    genders = [];
    interests = [];
    states = [];
    cities = [];
    @ViewChild('cities_select') cities_select: SelectComponent
    city_placeholder: string = 'Selecione'

    profile_image: string = null

    constructor(
        private alertService: AlertService,
        private loadingService: LoadingService,
        private userService: UserService,
        private enumService: EnumService,
        private toast: ToastService,
        private imageService: ImageService
    ) {
    }

    ngOnInit() {
        this.selfDeclarations = this.enumService.getDefault('selfDeclarations');
        this.genders = this.enumService.getDefault('genders');
        this.interests = this.enumService.getDefault('interests');
        this.states = this.enumService.getDefault('states');
        if (this.user.cityId) {
            this.loadCities(this.user.stateId)
        }

        if (this.user.profile_image_url) {
            this.profile_image = this.user.profile_image_url;
        }
    }

    loadCities(event: any) {
        let stateId
        if (typeof event === 'number' || typeof event === 'string')
            stateId = event
        else
            stateId = event.detail.value
        const original_city = this.user.cityId
        this.city_placeholder = 'Selecione'
        this.loadingService.present('Carregando cidades...');
        this.enumService.citiesState(stateId).subscribe((resp: any) => {
            this.loadingService.dismiss();
            this.cities = resp;
            if (original_city)
                this.cities.forEach(city => {
                    if (this.user.cityId == city.id)
                        this.cities_select.set_selected(city.name)
                })
        }, err => {
            this.loadingService.dismiss();
        })
    }

    async select_city(ev: any) {
        this.user.cityId = ev
    }

    preferences_changed(data) {
        this.user.preference_ids = data
    }

    async saveProfile() {
        if (this.user.is_valid()) {
            try {
                await this.loadingService.present();
                const resp: any = await this.userService.update(this.user).toPromise()
                console.log("🚀 ~ ProfileComponent ~ saveProfile ~ resp:", resp);
                this.loadingService.dismiss();
                if (resp.status !== 'success') {
                    return this.alertService.present(resp.errors_message);
                }
                this.user.completed_register = true;
                this.toast.present('Dados atualizados com sucesso!');
                this.on_save.emit(true);
            } catch (err) {
                console.log("🚀 ~ ProfileComponent ~ saveProfile ~ err:", err);
                this.loadingService.dismiss()
            };
        }
        this.user.errors().forEach(error => {
            this.toast.present(error)
        })
    }

    async touchOpenCamera(type: string) {
        await this.imageService.getImage(type).then((resp: any) => {
            console.log("🚀 ~ ProfileComponent ~ awaitthis.imageService.getImage ~ resp:", resp);
            if (resp) {
                this.profile_image = resp;
                this.user.profile_image = resp;
            }
        });

    }

}
