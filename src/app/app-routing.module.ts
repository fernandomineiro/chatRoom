import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then(m => m.MainPageModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'auth/sign-in',
    loadChildren: () => import('./pages/auth/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'auth/password-recovery',
    loadChildren: () => import('./pages/auth/password-recovery/password-recovery.module').then( m => m.PasswordRecoveryPageModule)
  },
  {
    path: 'auth/sign-up/step-first',
    loadChildren: () => import('./pages/auth/sign-up/step-first/step-first.module').then( m => m.StepFirstPageModule)
  },
  {
    path: 'auth/sign-up/step-second',
    loadChildren: () => import('./pages/auth/sign-up/step-second/step-second.module').then( m => m.StepSecondPageModule)
  },
  {
    path: 'terms/use',
    loadChildren: () => import('./pages/terms/use/use.module').then( m => m.UsePageModule)
  },
  {
    path: 'terms/privacy',
    loadChildren: () => import('./pages/terms/privacy/privacy.module').then( m => m.PrivacyPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }

// End of file app-routing.module.ts
// Path: ./src/app/app-routing.module.ts
