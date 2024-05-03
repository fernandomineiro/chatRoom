import { Component, OnInit } from '@angular/core';
import { AuthService, AlertService, LoadingService, ToastService } from '../../../services/index';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {
  formData: FormGroup;

  constructor(
    private alertService: AlertService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {}

  recoveryIt() {
    this.loadingService.present();

    this.authService.passwordRecovery(this.formData.value.email).subscribe((resp: any) => {
      this.loadingService.dismiss();

      if (resp.status == 'failed') {
        return this.alertService.present(resp.message);
      }

      this.toastService.present('Enviamos as instruções para o seu e-mail!');

      this.router.navigate(['/auth/sign-in']);
    });
  }
}

// End of file password-recovery.page.ts
// Path: ./src/app/pages/auth/password-recovery/password-recovery.page.ts
