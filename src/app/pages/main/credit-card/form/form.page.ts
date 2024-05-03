import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonValidateFilds } from '@starley/ion-directives';
import { AlertService, CardService, EnumService, LoadingService, ToastService } from '../../../../services/index';

@Component({
    selector: 'app-form',
    templateUrl: './form.page.html',
    styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
    formData: FormGroup;
    cardBrands = [];
    year = {
        min: 0,
        max: 0
    };

    constructor(
        private loadingService: LoadingService,
        private formBuilder: FormBuilder,
        private cardService: CardService,
        private enumService: EnumService,
        private toastService: ToastService,
        private alertService: AlertService,
        private router: Router,
        private ionValidateFilds: IonValidateFilds
    ) {
        this.formData = this.formBuilder.group({
            cardBannerId: ['', [Validators.required]],
            number: ['', [Validators.required]],
            name: ['', [Validators.required]],
            month: ['', [Validators.required]],
            year: ['', [Validators.required]],
            securityCode: ['', [Validators.required]],
            cpf: ['', [Validators.required]]
        });

        const year = new Date().getFullYear().toString();
        this.year.min = parseInt(year);
        this.year.max = parseInt(year) + 10;
    }

    ngOnInit() {
        this.loadingService.present();
        this.enumService.cardBrands().subscribe((resp: any) => {
            this.loadingService.dismiss();
            this.cardBrands = resp;
        });
    }

    save() {
        this.loadingService.present();

        this.cardService.create(this.formData).subscribe((resp: any) => {
            this.loadingService.dismiss();

            if (resp.status !== 'success') {
                return this.alertService.present(resp.errors_message);
            }

            this.router.navigate(['main/credit-card/index']);

            this.toastService.present('Cartão cadastrado com sucesso!');

        }, err => this.loadingService.dismiss())
    }

    isValidYear(): boolean {
        return this.formData.value.year >= this.year.min && this.formData.value.year <= this.year.max;
    }

    isCpfValid(): boolean {
        return this.ionValidateFilds.validarCPF(this.formData.value.cpf);
    }

    isValidMonth(): boolean {
        const regex = /^(0[1-9]|1[0-2])$/;
        return regex.test(this.formData.value.month);
    }

    async touchShowPopover() {
        let message = 'As informações fornecidas possuem sigilo e segurança, e são necessãrias para atender as normas da instituição financeira.'
        this.alertService.presentPopover(message);
    }

}

// End of file form.page.ts
// Path: ./src/app/pages/credit-card/form/form.page.ts
