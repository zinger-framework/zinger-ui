import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  @Input() title = 'Title';
  @Input() data = [{label: 'Home', link: '/dashboard'}];

  constructor() {
  }

  ngOnInit(): void {
  }
}
