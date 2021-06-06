import {Component, Input} from '@angular/core';
import {BaseComponent} from "../../base.component";

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent extends BaseComponent {
  @Input() title = 'Title';
  @Input() data = [{label: 'Home', link: '/dashboard'}];

  constructor() {
    super()
  }

  isLastElement(index) {
    return index == this.data.length - 1
  }
}
