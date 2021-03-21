import {Component} from '@angular/core';
import {JwtService} from '../../../core/service/jwt.service';
import {BaseComponent} from "../../../base.component";

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent extends BaseComponent {
  isAuthenticated = false;

  constructor(public jwtService: JwtService) {
    super();
  }

  ngOnInit(): void {
    this.isAuthenticated = this.jwtService.isLoggedIn();
  }
}
