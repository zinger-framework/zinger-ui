import {Component} from '@angular/core';
import {BaseComponent} from "../../../../base.component";

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent extends BaseComponent {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
