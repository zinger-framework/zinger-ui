import {Component, OnInit} from '@angular/core';
import {JwtService} from '../../../core/service/jwt.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAuthenicated = false;

  constructor(public jwtService: JwtService) {
  }

  ngOnInit(): void {
    this.isAuthenicated = this.jwtService.isAuthTokenPresent();
  }
}
