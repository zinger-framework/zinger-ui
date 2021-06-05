import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {JwtService} from "../jwt.service";
import {APP_ROUTES} from "../../utils/constants.utils";

@Injectable({
  providedIn: 'root'
})
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
