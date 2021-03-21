import {Component, Input} from '@angular/core';
import {AuthService} from "../../../core/service/auth.service";
import {JwtService} from "../../../core/service/jwt.service";
import {Router} from "@angular/router";
import {APP_ROUTES} from "../../../core/utils/constants.utils";
import {BaseComponent} from "../../../base.component";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent {
  @Input() name: string;

  constructor(private authService: AuthService, private jwtService: JwtService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.name = 'Logesh';
  }

  logout() {
    this.authService.logout().finally(() => this.router.navigate([APP_ROUTES.AUTH_LOGIN]));
  }
}
