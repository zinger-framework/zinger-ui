import {Component, OnInit} from '@angular/core';
import {ShopService} from "../../../../core/service/platform/shop.service";
import {SortType, ColumnMode} from "@swimlane/ngx-datatable"

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent implements OnInit {

  rows = [];
  isLoading = false;
  columns = [
    {name: 'Id', prop: 'id', width: -10}, 
    {name: 'Name', prop: 'name', width:50}, 
    {name: 'Category', prop: 'category', width:50}, 
    {name: 'Tags', prop: 'tags', sortable: false, width:50}, 
    {name: 'Description', prop: 'description', sortable: false, width:50}
  ];
  SortType = SortType;
  ColumnMode = ColumnMode;

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getShopList();
  }

  getShopList() {
    this.isLoading = true;
    this.shopService.getShopList()
    .then(response => {
      this.isLoading = true;
      this.rows = response['data']['shops']
    })
    .catch(error => {
      this.isLoading = true;
      console.log(error)
    })
  }

}
