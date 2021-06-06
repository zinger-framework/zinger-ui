import {Component, Input} from '@angular/core';
import {AuthService} from "../../../../core/service/platform/auth.service";
import {BaseComponent} from "../../../../base.component";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent {
  name: string;

  constructor(private authService: AuthService) {
    super();
  }

  ngOnInit(): void {
    this.name = 'User'; // TODO: Replace with actual user_name - Logesh
  }

  logout() {
    this.authService.logout();
  }
}
