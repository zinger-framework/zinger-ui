import {Component, Input} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {NgbAccordion} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'accordion-header',
  templateUrl: './accordion-header.component.html',
  styleUrls: ['./accordion-header.component.css']
})
export class AccordionHeaderComponent extends BaseComponent {
  @Input() title: string;
  @Input() opened: string;
  @Input() accordion: NgbAccordion;
  @Input() panelId: string;

  constructor() {
    super()
  }

  expandPanel() {
    this.accordion.isExpanded(this.panelId) ? this.accordion.collapse(this.panelId) : this.accordion.expand(this.panelId);
  }
}
