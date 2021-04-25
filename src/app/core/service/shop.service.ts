import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ShopService extends ApiService {

  addNewShop(request_body) {
    console.log("Add Shop API will be called")
  }

  updateShopDetails(request_body) {
    console.log("Update Shop will be called")
  }
}
