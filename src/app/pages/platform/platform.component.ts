import {Component} from '@angular/core';
import {JwtService} from "../../core/service/jwt.service";
import {BaseComponent} from "../../base.component";

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent extends BaseComponent {
  constructor(public jwtService: JwtService) {
    super();
  }
}
