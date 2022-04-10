import {Component} from '@angular/core';

import {ItemConfigService} from "../../../../core/service/platform/item-config.service";

import {BaseComponent} from '../../../../base.component';

@Component({
  selector: 'app-item-config-list',
  templateUrl: './item-config-list.component.html',
  styleUrls: ['./item-config-list.component.css']
})
export class ItemConfigListComponent extends BaseComponent {
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
