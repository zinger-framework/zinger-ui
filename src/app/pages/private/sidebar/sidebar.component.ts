import {Component, OnInit} from '@angular/core';
import {JwtService} from '../../../core/service/jwt.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAuthenticated = false;

  constructor(public jwtService: JwtService) {
  }

  ngOnInit(): void {
    this.isAuthenticated = this.jwtService.isLoggedIn();
  }
}
