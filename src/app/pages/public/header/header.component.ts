import {Component, Input, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() navDataUrl: string;
  @Input() navDataTitle: string;

  constructor(private route: Router) {
    route.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      if (event instanceof RouterEvent) {
        if (event.url.includes('login')) {
          this.navDataTitle = 'Register';
          this.navDataUrl = '/auth/register';
        } else {
          this.navDataTitle = 'Login';
          this.navDataUrl = '/auth/login';
        }
      }
    });
  }

  ngOnInit(): void {
  }
}
