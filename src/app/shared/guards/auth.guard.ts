import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { UserService } from "src/app/services";

@Injectable({
    providedIn: 'root'
  })
export class AuthGuard implements CanActivate, CanActivateChild{
    constructor(
        private router: Router,
        private user: UserService
    ) { }

    async validate() {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const user = await this.user.get()
                if (!user.completed_register)
                    return this.complete_register()
            } catch (error) {
                return this.login()
            }
            return Promise.resolve(true);
        }
        return this.login()
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        return this.validate()
    }
    
    async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        return this.validate()   
    }

    complete_register() {
        this.router.navigateByUrl('/auth/sign-up/step-second')
        return Promise.resolve(false)
    }

    login() {
        this.router.navigateByUrl('/auth/sign-in')
        return Promise.resolve(false)
    }
}