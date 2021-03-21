import {Component} from '@angular/core';
import {BaseComponent} from "../../base.component";

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent extends BaseComponent {
  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
