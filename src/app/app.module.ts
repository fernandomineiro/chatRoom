import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { AuthGuard } from './shared/guards/auth.guard';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationService } from './services';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        HttpClientModule,
        BrowserModule,
        IonicModule.forRoot({
            backButtonText: 'Voltar'
        }),
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
    ],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        AuthGuard,
        Insomnia,
        NavigationService],
    bootstrap: [AppComponent],
})

export class AppModule { }

// End of file app.module.ts
// Path: ./src/app/app.module.ts
