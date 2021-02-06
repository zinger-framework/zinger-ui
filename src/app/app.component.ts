import {Component} from '@angular/core';
import {CommonUtils} from './core/utils/common.utils';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zinger-ui';

  constructor(private route: Router) {
    const url = CommonUtils.fetchUrl(this.route);
    console.log(url);
  }
}
