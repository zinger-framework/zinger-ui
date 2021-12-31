import {Injectable} from '@angular/core';

import {AdminService} from "./admin.service";
import {API_ENDPOINTS} from "../../utils/constants.utils";

@Injectable({
  providedIn: 'root'
})
export class ItemService extends AdminService {
  addNewItem(shopId, requestBody) {
    return this.post(`${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}`, requestBody);
  }

  getItemList(shopId, params = ''){
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}`
    let endPoint = (params == '') ? url : `${url}?${params}`
    return this.get(endPoint);
  }

  getItemDetails(shopId) {
    // return this.get(API_ENDPOINTS.SHOP + '/' + shopId);
  }

  updateItemDetails(shopId, requestBody) {
    // return this.put(API_ENDPOINTS.SHOP + '/' + shopId, requestBody);
  }

  uploadIcon(shopId, requestBody) {
    // return this.sendFormData(API_ENDPOINTS.SHOP + '/' + shopId + '/icon', requestBody)
  }

  uploadCoverPhoto(shopId, requestBody) {
    // return this.sendFormData(API_ENDPOINTS.SHOP + '/' + shopId + '/cover_photo', requestBody)
  }

  deleteIcon(shopId) {
    // return this.delete(API_ENDPOINTS.SHOP + '/' + shopId + '/icon')
  }

  deleteCoverPhoto(shopId, imageId) {
    // return this.delete(API_ENDPOINTS.SHOP + '/' + shopId + '/cover_photo/' + imageId)
  }
}
