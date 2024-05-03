import { Component, OnInit } from '@angular/core';
import { Access, User } from 'src/app/services/user/model';
import { AlertService, LoadingService, ToastService, UserService } from '../../../services/index';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
    user: User
    loaded: boolean
    access: Access
    constructor(
        private alertService: AlertService,
        private loadingService: LoadingService,
        private userService: UserService,
        private toast: ToastService
    ) {
        this.access = new Access
        this.user = new User
    }

    async ngOnInit() {
        this.loaded = false
        await this.loadingService.present();
        this.userService.refresh().then((user: User) => {
            this.loadingService.dismiss();
            this.user.setup(user)
            this.loaded = true
            this.access.email = this.user.email;
        }, err => this.loadingService.dismiss())
    }

    saveAccess() {
        if (!this.access.is_valid())
            return this.access.errors().forEach(error => {
                this.toast.present(error)
            })
        this.loadingService.present();
        this.access.email = this.access.email.trim()
        this.userService.updateAccessData(this.access).subscribe((resp: any) => {
            this.loadingService.dismiss();

            if (resp.status !== 'success')
                return this.alertService.present(resp.errors_message);

            this.toast.present('Dados de acesso atualizados com sucesso!');

        }, err => this.loadingService.dismiss());
    }


    isPasswordEquals(): boolean {
        if (this.access.password.length > 0 && this.access.password === this.access.passwordRepeat) return true
        return false;
    }

    updateUserData(event: boolean) {
        if (event) this.ngOnInit();
    }
}

// End of file profile.page.ts
// Path: ./src/app/pages/profile/profile.page.ts
