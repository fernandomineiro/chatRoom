import { Component, OnInit } from '@angular/core';
import { AuthService, EnumService, AlertService, LoadingService, ToastService } from '../../../services/index';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})

export class SignInPage implements OnInit {
  formData: FormGroup;
  contactEmail: string;

  constructor(
    private alertService: AlertService,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private enumService: EnumService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    SplashScreen.hide();
    this.loadingService.present();
    this.authService.logout()
    this.enumService.settings().subscribe((resp: any) => {
      this.loadingService.dismiss();
      if (resp.status == 'failed') return this.alertService.present(resp.message);
      this.contactEmail = resp.contact_mail;
    });
  }

  signIn() {
    this.loadingService.present();

    this.authService.login(this.formData.value.email, this.formData.value.password).subscribe((resp: any) => {
      this.loadingService.dismiss();

      if (resp.status == 'failed') return this.alertService.present(resp.message);

      localStorage.token = resp.token;

      this.toastService.present('Seja bem vindo (a)!');

      this.router.navigate(['/main/home']);
    });
  }
}

// End of file sign-in.page.ts
// Path: ./src/app/pages/auth/sign-in/sign-in.page.ts
