import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  getData(key): string {
    return window.localStorage[key];
  }

  saveData(key: string, value: string) {
    window.localStorage[key] = value;
  }

  destroyData(key: string) {
    window.localStorage.removeItem(key);
  }
}
