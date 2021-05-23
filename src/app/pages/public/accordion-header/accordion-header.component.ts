import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'accordion-header',
  templateUrl: './accordion-header.component.html',
  styleUrls: ['./accordion-header.component.css']
})
export class AccordionHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() opened: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
