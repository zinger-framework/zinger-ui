import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ShopService extends ApiService {

  addNewShop() {
    console.log("Add Shop API will be called")
  }

  updateShopDetails() {
    console.log("Update Shop will be called")
  }
}
