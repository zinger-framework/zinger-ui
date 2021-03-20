import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {APP_ROUTES} from "../utils/constants.utils";
import {JwtService} from "./jwt.service";

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public jwtService: JwtService, public router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let pageType = route.data.page;

    if (pageType == 'PUBLIC' && this.jwtService.isLoggedIn()) {
      this.router.navigate([APP_ROUTES.DASHBOARD]);
      return false;
    }

    if (pageType != 'PUBLIC' && !this.jwtService.isLoggedIn()) {
      this.router.navigate([APP_ROUTES.AUTH_LOGIN]);
      return false;
    }
    return true;
  }
}
