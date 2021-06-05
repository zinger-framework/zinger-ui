import {Injectable} from '@angular/core';

import {API_ENDPOINTS} from "../../utils/constants.utils";
import {PlatformService} from "./platform.service";

@Injectable({
  providedIn: 'root'
})
export class ShopService extends PlatformService {
  getShopDetails(shopId) {
    return this.get(API_ENDPOINTS.SHOP + '/' + shopId);
  }

  updateShopDetails(shopId, requestBody) {
    return this.put(API_ENDPOINTS.SHOP + '/' + shopId, requestBody);
  }
}
