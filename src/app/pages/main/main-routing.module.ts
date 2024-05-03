import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then(m => m.AboutPageModule)
      },
      {
        path: 'contact',
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactPageModule)
      },
      {
        path: 'credit-card/index',
        loadChildren: () => import('./credit-card/index/index.module').then(m => m.IndexPageModule)
      },
      {
        path: 'credit-card/form',
        loadChildren: () => import('./credit-card/form/form.module').then(m => m.FormPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'credit-statement',
        loadChildren: () => import('./credit-statement/credit-statement.module').then(m => m.CreditStatementPageModule)
      },
      {
        path: 'payment/list',
        loadChildren: () => import('./payment/list/list.module').then(m => m.ListPageModule)
      },
      {
        path: 'payment/buy/:planId',
        loadChildren: () => import('./payment/buy/buy.module').then(m => m.BuyPageModule)
      },
      {
        path: 'chat/active',
        loadChildren: () => import('./chat/active/active.module').then(m => m.ActivePageModule)
      },
      {
        path: 'chat/waiting',
        loadChildren: () => import('./chat/waiting/waiting.module').then(m => m.WaitingPageModule)
      },
      {
        path: 'chat/pending',
        loadChildren: () => import('./chat/pending/pending.module').then(m => m.PendingPageModule)
      },
      {
        path: 'chat/search/form',
        loadChildren: () => import('./chat/search/form/form.module').then(m => m.FormPageModule)
      },
      {
        path: 'chat/search/result',
        loadChildren: () => import('./chat/search/result/result.module').then(m => m.ResultPageModule)
      },
      {
        path: 'tutorial',
        loadChildren: () => import('./tutorial/tutorial.module').then(m => m.TutorialPageModule)
      },
      {
        path: 'chat/modal',
        loadChildren: () => import('./chat/modal/modal.module').then(m => m.ModalPageModule)
      },
      {
        path: 'chat/dialog/:id',
        loadChildren: () => import('./chat/dialog/dialog.module').then(m => m.DialogPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class MainRoutingModule { }

// End of file app-routing.module.ts
// Path: ./src/app/app-routing.module.ts
