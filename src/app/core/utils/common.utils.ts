import {filter} from 'rxjs/operators';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';

export class CommonUtils {
  static fetchUrl(route: Router) {
    route.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      if (event instanceof RouterEvent) {
        return event.url;
      }
    });
  }
}
