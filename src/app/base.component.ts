import {AfterViewInit, OnInit} from '@angular/core';
import {APP_ROUTES} from './core/utils/constants.utils';
import {ColumnMode} from '@swimlane/ngx-datatable'

export class BaseComponent implements OnInit, AfterViewInit {
  ColumnMode = ColumnMode
  Array = Array

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  getRoute(route: string): string {
    return APP_ROUTES[route];
  }
}
