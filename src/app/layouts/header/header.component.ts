import {Component, OnInit} from '@angular/core';
import {JwtService} from '../../core/service/jwt.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  name: String = '';
  isAuthenticated: Boolean = false;

  constructor(public jwtService: JwtService) {
  }

  ngOnInit(): void {
    this.name = 'Logesh';
    this.isAuthenticated = this.jwtService.isLoggedIn();
  }
}
