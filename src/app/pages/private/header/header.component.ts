import {Component, Input, OnInit} from '@angular/core';
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
    this.authService.logout();
  }
}
