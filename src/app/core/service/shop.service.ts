import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {API_ENDPOINTS} from "../utils/constants.utils";

@Injectable({
  providedIn: 'root'
})
export class ShopService extends ApiService {

  addNewShop() {
    return this.get(API_ENDPOINTS.SHOP_NEW);
  }

  getShopDetails(shopId){
    return this.get(API_ENDPOINTS.SHOP+'/'+shopId);
  }

  updateShopDetails(shopId,requestBody) {
    return this.post(API_ENDPOINTS.SHOP+'/'+shopId, requestBody);
  }

  uploadIcon(shopId,requestBody){
    return this.post(API_ENDPOINTS.SHOP+'/'+shopId+'/icon',requestBody,'multipart/form-data')
  }
}
