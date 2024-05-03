import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonValidateFilds } from '@starley/ion-directives';
import { AlertService, CardService, EnumService, LoadingService, PlanService, ToastService, UserService } from '../../../../services/index';

@Component({
    selector: 'app-buy',
    templateUrl: './buy.page.html',
    styleUrls: ['./buy.page.scss'],
})

export class BuyPage implements OnInit {
    plan: {
        id: number,
        name: string,
        minutes: number,
        price: number,
        priceFormatted: string
    } = {
            id: 0,
            name: '',
            minutes: 0,
            price: 0,
            priceFormatted: 'R$ 0,00'
        }

    paymentType: string = 'my-card';
    cards = [];
    cardBrands = [];
    newCard: FormGroup;
    selectedCardId = 0;
    planId = 0;

    year = {
        min: 0,
        max: 0
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private planService: PlanService,
        private loadingService: LoadingService,
        private enumService: EnumService,
        private cardService: CardService,
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private router: Router,
        private ionValidateFilds: IonValidateFilds,
        private alertService: AlertService,
        private userService: UserService
    ) {
        this.newCard = this.formBuilder.group({
            cardBannerId: ['', [Validators.required]],
            cardNumber: ['', [Validators.required]],
            cardName: ['', [Validators.required]],
            month: ['', [Validators.required]],
            year: ['', [Validators.required]],
            code: ['', [Validators.required]],
            cpf: ['', [Validators.required]]
        });

        const year = new Date().getFullYear().toString();
        this.year.min = parseInt(year);
        this.year.max = parseInt(year) + 10;
    }

    ngOnInit() {
        this.cardBrands = this.enumService.getDefault('cardBrands');

        this.activatedRoute.paramMap.subscribe(params => {
            this.planId = parseInt(params.get('planId'));
            this.loadingService.present();
            this.loadPlan();
        });
    }

    changePaymentType(event: any) {
        this.paymentType = event.detail.value;
    }

    payNewCard() {
        this.loadingService.present();

        this.planService.buyWithCard(this.planId, this.newCard).subscribe((resp: any) => {
            this.loadingService.dismiss();

            if (resp.status !== 'success') {
                return this.toastService.present(resp.errors);
            }

            this.successfullyPayment();
        }, err => this.loadingService.dismiss());
    }

    paySelectedCard() {
        this.loadingService.present();

        this.planService.buy(this.planId, this.selectedCardId).subscribe((resp: any) => {
            this.loadingService.dismiss();
            if (resp.status !== 'success') {
                return this.toastService.present(resp.errors);
            }

            this.successfullyPayment();
        }, err => this.loadingService.dismiss());
    }

    private successfullyPayment() {
        this.userService.refresh();
        this.toastService.present('Seus créditos foram adquiridos com sucesso!');
        this.router.navigate(['/main/home']);
    }

    private loadPlan() {

        this.enumService.plan(this.planId).subscribe((resp: any) => {
            this.plan.id = resp.id;
            this.plan.name = resp.name;
            this.plan.minutes = resp.minutes;
            this.plan.price = resp.price;
            this.plan.priceFormatted = resp.price_formatted;

            this.loadCards();

        }, err => this.loadingService.dismiss())
    }

    private loadCards() {
        this.cardService.all().subscribe((resp: any) => {
            this.loadingService.dismiss();
            this.cards = resp;
        }, err => this.loadingService.dismiss());
    }


    isValidYear(): boolean {
        return this.newCard.value.year >= this.year.min && this.newCard.value.year <= this.year.max;
    }

    isCpfValid(): boolean {
        return this.ionValidateFilds.validarCPF(this.newCard.value.cpf);
    }

    isValidMonth(): boolean {
        const regex = /^(0[1-9]|1[0-2])$/;
        return regex.test(this.newCard.value.month);
    }

    async touchShowPopover() {
        let message = 'As informações fornecidas possuem sigilo e segurança, e são necessãrias para atender as normas da instituição financeira.'
        this.alertService.presentPopover(message);
    }
}

// End of file buy.page.ts
// Path: ./src/app/pages/payment/buy/buy.page.ts
