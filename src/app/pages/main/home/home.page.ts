import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BlockUserComponent } from 'src/app/shared/components/block-user/block-user.component';
import { ChatService, LoadingService, UserService } from '../../../services/index';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
    users = [];
    tutorial = {
        image: 'assets/images/tutorial.png',
        show: true
    };

    disabledChatButton = false;

    constructor(
        private loadingService: LoadingService,
        private chatService: ChatService,
        private router: Router,
        private userService: UserService,
        private zone: NgZone,
        private modalCtrl: ModalController
    ) { }

    async ngOnInit() {
        this.loadData();
    }

    async ngAfterContentInit() {
        await this.loadData();
        let userData = await this.userService.get();
        if (userData.current_balance <= 0) {
            this.disabledChatButton = true;
        }

        // This update list of users every 60 seconds
        setInterval(() => {
            this.loadData();
        }, 20000);
    }

    hideTutorial() {
        this.tutorial.show = false;
    }

    sendInvite(user: any) {
        this.chatService.info = {
            backUrl: '/main/home',
            id: user.id,
            image: user.profile_image_url,
            title: user.complete_title_text,
            gender: JSON.stringify(user.sex),
            interest: JSON.stringify(user.interest),
            yourselfDeclaration: JSON.stringify(user.declare_yourself),
            preferences: JSON.stringify(user.preferences),
        }
        this.router.navigate(['/main/chat/modal']);
    }

    async touchBlockUser(user: any) {
        const popover = await this.modalCtrl.create({
            component: BlockUserComponent,
            cssClass: 'scss',
            componentProps: { user: user }
        });

        await popover.present();

        await popover.onDidDismiss().then((data) => {
            if (data.data === 'block_user') {
                this.zone.run(() => { this.loadData(); });
            }
        });

    }

    async loadData() {
        this.chatService.sample().subscribe((resp: any) => {
            this.users = resp.users;
        }, err => this.loadingService.dismiss());
    }

    tutorial_style() {
        if (this.tutorial.show)
            return 'display: block;'
        return 'display: none;'
    }
}

// End of file home.page.ts
// Path: ./src/app/pages/home/home.page.ts
