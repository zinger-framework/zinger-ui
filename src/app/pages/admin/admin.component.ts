import {Component} from '@angular/core';
import {JwtService} from "../../core/service/jwt.service";
import {BaseComponent} from "../../base.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent extends BaseComponent {
  constructor(public jwtService: JwtService) {
    super();
  }
}
