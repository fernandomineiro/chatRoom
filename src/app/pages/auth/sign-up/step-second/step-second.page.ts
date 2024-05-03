import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService, UserService } from 'src/app/services';
import { User } from 'src/app/services/user/model';

@Component({
    selector: 'app-step-second',
    templateUrl: './step-second.page.html',
    styleUrls: ['./step-second.page.scss'],
})
export class StepSecondPage implements OnInit {

    user: User
    constructor(
        private loadingService: LoadingService,
        private userService: UserService,
        private router: Router,
    ) {
        this.user = new User
    }

    ngOnInit() {
        this.loadingService.present();
        this.userService.refresh().then((user: User) => {
            this.user = user
            this.loadingService.dismiss();
        }, err => this.loadingService.dismiss())
    }

    redirect(event: boolean) {
        console.log("🚀 ~ StepSecondPage ~ redirect ~ event:", event);
        if (event) this.router.navigate(['/main']);
    }
}
