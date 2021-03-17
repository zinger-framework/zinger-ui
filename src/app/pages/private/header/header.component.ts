import {Component, Input, OnInit} from '@angular/core';
import {APP_ROUTES} from "../../../core/utils/constants.utils";
import {AuthService} from "../../../core/service/auth.service";
import {JwtService} from "../../../core/service/jwt.service";
import {Router} from "@angular/router";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() name: string;

  constructor(private authService: AuthService, private jwtService: JwtService, private router: Router) {
  }

  ngOnInit(): void {
    this.name = 'Logesh';
  }

  logout() {
    this.authService.logout()
      .then(response => {
        this.jwtService.destroyToken();
        this.router.navigate([APP_ROUTES.AUTH_LOGIN])
      })
      .catch(error => {
        console.log("toast error: " + error)
      });
  }
}
