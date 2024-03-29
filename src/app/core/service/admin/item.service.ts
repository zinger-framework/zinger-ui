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

  addNewVariant(shopId, itemId, requestBody) {
    return this.post(`${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}/${itemId}/variant`, requestBody);
  }

  getItemList(shopId, params = '') {
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}`
    let endPoint = (params == '') ? url : `${url}?${params}`
    return this.get(endPoint);
  }

  getItemDetails(shopId, itemId) {
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}/${itemId}`
    return this.get(url);
  }

  updateItemDetails(shopId, itemId, requestBody) {
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}/${itemId}`
    return this.put(url, requestBody);
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

  deleteVariant(shopId, itemId, variantId) {
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}/${itemId}/variant/${variantId}`
    return this.delete(url)
  }

  deleteItem(shopId, requestBody) {
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}/delete`
    return this.post(url, requestBody)
  }

  getMeta() {
    return this.get(`${API_ENDPOINTS.API_VERSION}/${API_ENDPOINTS.ITEM}/meta`)
  }
}
