import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../service/jwt.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isAuthenicated: Boolean = false;

  constructor(public jwtService: JwtService) { }

  ngOnInit(): void {
    this.isAuthenicated = this.jwtService.isLoggedIn();
  }

}
