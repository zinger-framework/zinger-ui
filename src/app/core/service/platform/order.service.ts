import {Injectable} from '@angular/core';

import {PlatformService} from "./platform.service";
import {API_ENDPOINTS} from "../../utils/constants.utils";

@Injectable({
  providedIn: 'root'
})
export class OrderService extends PlatformService {
  getOrderList(shopId, params = '') {
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ORDER}`
    let endPoint = (params == '') ? url : `${url}?${params}`;
    return this.get(endPoint);
  }

  getOrderDetails(shopId, orderId) {
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ORDER}/${orderId}`
    return this.get(url);
  }

  updateOrderDetails(shopId, orderId, requestBody) {
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ORDER}/${orderId}`
    return this.put(url, requestBody);
  }
}
