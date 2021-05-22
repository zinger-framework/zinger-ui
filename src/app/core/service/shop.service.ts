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

  deleteCoverPhoto(shopId, imageIndex) {
    return this.delete(API_ENDPOINTS.SHOP + '/' + shopId + '/cover_photo/' + imageIndex)
  }
}
