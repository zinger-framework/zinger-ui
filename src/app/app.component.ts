import {Component} from '@angular/core';
import {BaseComponent} from "./base.component";
import {SUB_DOMAIN} from "./app-routing.module";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent {
  constructor() {
    super();
  }

  getSubDomain(): string {
    return SUB_DOMAIN;
  }
}
