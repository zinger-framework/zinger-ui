import {Component} from '@angular/core';

import {ItemConfigService} from "../../../../core/service/platform/item-config.service";

import {BaseComponent} from '../../../../base.component';

@Component({
  selector: 'app-platform-config',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.css']
})
export class ConfigListComponent extends BaseComponent {
  readonly headerHeight = 50;
  readonly rowHeight = 50;
  readonly pageLimit = 10;
  isLoading = true
  rows = []

  constructor(private itemConfigService: ItemConfigService) {
    super()
  }

  ngOnInit() {
    this.getConfigList();
  }

  getConfigList() {
    this.isLoading = true

    this.itemConfigService.getItemConfigList()
      .then(response => {
        this.rows = response['data']
      })
      .finally(() => {
        this.isLoading = false
      })
  }
}
