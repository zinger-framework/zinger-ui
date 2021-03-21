import { OnInit, AfterViewInit } from '@angular/core';
import {APP_ROUTES} from './core/utils/constants.utils';

export class BaseComponent implements OnInit, AfterViewInit {

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
