import {Injectable} from '@angular/core';

import {PlatformService} from "./platform.service";
import {API_ENDPOINTS} from "../../utils/constants.utils";

@Injectable({
  providedIn: 'root'
})
export class ItemConfigService extends PlatformService {
  getItemConfigList() {
    let endPoint = API_ENDPOINTS.ITEM_CONFIG;
    return this.get(endPoint);
  }
}
