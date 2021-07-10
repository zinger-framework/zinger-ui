import {Injectable} from '@angular/core';

import {PlatformService} from "./platform.service";
import {API_ENDPOINTS} from "../../utils/constants.utils";

@Injectable({
  providedIn: 'root'
})
export class ShopService extends PlatformService {
  getShopDetails(shopId) {
    return this.get(API_ENDPOINTS.SHOP + '/' + shopId);
  }

  getShopList(start_time = '2020-06-06 00:00:00', end_time = '2022-06-06 00:09:00'){
    return this.get(API_ENDPOINTS.SHOP);
  }

  updateShopDetails(shopId, requestBody) {
    return this.put(API_ENDPOINTS.SHOP + '/' + shopId, requestBody);
  }

  deleteShop(shopId) {
    return this.delete(API_ENDPOINTS.SHOP + '/' + shopId);
  }
}
