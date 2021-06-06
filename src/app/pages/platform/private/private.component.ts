import {Component} from '@angular/core';
import {BaseComponent} from "../../../base.component";

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent extends BaseComponent {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
