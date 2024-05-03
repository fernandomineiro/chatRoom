import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, ApiService, EnumService, LoadingService, UserService } from '../../../../services';

@Component({
    selector: 'app-step-first',
    templateUrl: './step-first.page.html',
    styleUrls: ['./step-first.page.scss'],
})

export class StepFirstPage implements OnInit {
    public content: string;
    showUserTerms: boolean = true
    acceptedTerms: boolean = false

    form: {
        name: string
        email: string
        password: string
        passwordConfirmation: string,
        confirm_email: string
    }

    constructor(
        private alertService: AlertService,
        private loadingService: LoadingService,
        private user: UserService,
        private router: Router,
        private api: ApiService,
        private enumService: EnumService
    ) {
        this.carregarTermosDeUso();
    }

    ngOnInit() {
        this.form = {
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            confirm_email: ''
        }
    }

    async signUp() {
        this.loadingService.present();
        this.form.email = this.form.email.trim()
        this.form.confirm_email = this.form.confirm_email.trim()
        const emptyFields = this.form.name == '' || this.form.email == '' || this.form.password == '' || this.form.passwordConfirmation == '' || this.form.confirm_email == '';
        const invalidPassword = this.form.password !== this.form.passwordConfirmation;
        const invalidEmail = this.form.email !== this.form.confirm_email;
        try {

            if (emptyFields) {
                throw 'Todos os campos são obrigatórios';
            }

            if (invalidPassword) {
                throw 'As senhas devem ser iguais';
            }
            if (invalidEmail) {
                throw 'Os emails devem ser iguais';
            }
            const data: any = await this.user.create(this.form).toPromise()
            if (data.status !== 'success') {
                throw data.errors_message
            }
            this.api.setAuthToken((data as any).token)
            this.loadingService.dismiss()
            this.router.navigate(['auth', 'sign-up', 'step-second'])

        } catch (err) {
            this.alertService.present(err);
            this.loadingService.dismiss()
        }

    }

    carregarTermosDeUso() {
        this.enumService.settings().subscribe((resp: any) => {
            this.loadingService.dismiss();
            if (resp.status == 'failed') return this.alertService.present(resp.message);
            this.content = resp.use_policy;
        });
    }
}

// End of file step-first.page.ts
// Path: ./src/app/pages/auth/sign-up/step-first/step-first.page.ts
