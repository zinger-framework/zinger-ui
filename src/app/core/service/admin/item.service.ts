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

  uploadIcon(shopId, itemId, requestBody) {
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}/${itemId}/icon`
    return this.sendFormData(url, requestBody)
  }

  uploadCoverPhoto(shopId, itemId, requestBody) {
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}/${itemId}/cover_photo`
    return this.sendFormData(url, requestBody)
  }

  deleteIcon(shopId, itemId) {
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}/${itemId}/icon`
    return this.delete(url)
  }

  deleteCoverPhoto(shopId, itemId, imageId) {
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}/${itemId}/cover_photo/${imageId}`
    return this.delete(url)
  }
}
