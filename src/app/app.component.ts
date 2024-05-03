import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { EnumService, NavigationService } from './services';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})

export class AppComponent {

    constructor(
        private enumService: EnumService,
        private platform: Platform,
        private navigationService: NavigationService
    ) {
        this.enumService.loadDefaults();
        SplashScreen.show({
            autoHide: true,
            showDuration: 5000
        });

        this.hardwareBackButton();
    }

    async hardwareBackButton() {
        // subscribeWithPriority (“@ ionic / angular”: “4.0.0-rc.0”) corrige o comportamento estranho ao combinar softwares e botões de retorno de hardware. Seu comportamento atual pode variar com as versões consecutivas.
        this.platform.backButton.subscribeWithPriority(10, async () => {
            await this.navigationService.navigateToPreviousPage();
        });
    }

}

// End of file app.component.ts
// Path: ./src/app/app.component.ts
