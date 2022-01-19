import {Injectable} from '@angular/core';

import {AdminService} from "./admin.service";
import {API_ENDPOINTS} from "../../utils/constants.utils";

@Injectable({
  providedIn: 'root'
})
export class ShopService extends AdminService {
  addNewShop() {
    return this.get(API_ENDPOINTS.SHOP_NEW);
  }

  getShopList(params = '') {
    let endPoint = (params == '') ? API_ENDPOINTS.SHOP : API_ENDPOINTS.SHOP + '?' + params;
    return this.get(endPoint);
  }

  getShopDetails(shopId) {
    return this.get(API_ENDPOINTS.SHOP + '/' + shopId);
  }

  updateShopDetails(shopId, requestBody) {
    return this.put(API_ENDPOINTS.SHOP + '/' + shopId, requestBody);
  }

  uploadIcon(shopId, requestBody) {
    return this.sendFormData(API_ENDPOINTS.SHOP + '/' + shopId + '/icon', requestBody)
  }

  uploadCoverPhoto(shopId, requestBody) {
    return this.sendFormData(API_ENDPOINTS.SHOP + '/' + shopId + '/cover_photo', requestBody)
  }

  deleteIcon(shopId) {
    return this.delete(API_ENDPOINTS.SHOP + '/' + shopId + '/icon')
  }

  deleteCoverPhoto(shopId, imageId) {
    return this.delete(API_ENDPOINTS.SHOP + '/' + shopId + '/cover_photo/' + imageId)
  }
}
