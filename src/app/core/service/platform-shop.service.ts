import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {API_ENDPOINTS} from "../utils/constants.utils";

@Injectable({
  providedIn: 'root'
})
export class PlatformShopService extends ApiService {

  getShopDetails(shopId) {
    return this.get(API_ENDPOINTS.SHOP + '/' + shopId);
  }

  updateShopDetails(shopId, requestBody) {
    return this.put(API_ENDPOINTS.SHOP + '/' + shopId, requestBody);
  }

}
