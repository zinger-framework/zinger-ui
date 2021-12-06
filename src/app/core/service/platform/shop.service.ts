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

  getShopList(params = ''){
    let endPoint = (params == '') ? API_ENDPOINTS.SHOP : API_ENDPOINTS.SHOP + '?' + params;
    return this.get(endPoint);
  }

  updateShopDetails(shopId, requestBody) {
    return this.put(API_ENDPOINTS.SHOP + '/' + shopId, requestBody);
  }

  deleteShop(requestBody) {
    return this.post(API_ENDPOINTS.SHOP_DELETE, requestBody);
  }
}
