import {Component, Input} from '@angular/core';
import {BaseComponent} from "../../../base.component";

@Component({
  selector: 'accordion-header',
  templateUrl: './accordion-header.component.html',
  styleUrls: ['./accordion-header.component.css']
})
export class AccordionHeaderComponent extends BaseComponent {
  @Input() title: string;
  @Input() opened: string;

  constructor() {
    super()
  }
}
