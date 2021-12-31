import {Injectable} from '@angular/core';

import {PlatformService} from "./platform.service";
import {API_ENDPOINTS} from "../../utils/constants.utils";

@Injectable({
  providedIn: 'root'
})
export class ItemService extends PlatformService {
  
  getItemList(shopId, params = ''){
    let url = `${API_ENDPOINTS.SHOP}/${String(shopId)}/${API_ENDPOINTS.ITEM}`
    let endPoint = (params == '') ? url : `${url}?${params}`
    return this.get(endPoint);
  }

  getItemDetails(shopId) {
    // return this.get(API_ENDPOINTS.SHOP + '/' + shopId);
  }
}
