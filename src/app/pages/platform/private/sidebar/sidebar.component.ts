import {Component} from '@angular/core';
import {BaseComponent} from "../../../../base.component";

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent extends BaseComponent {
  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
