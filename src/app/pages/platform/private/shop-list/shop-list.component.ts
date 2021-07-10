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
  rows2 = [
  {
    "id": 4,
    "name": "Sathyas Canteen",
    "category": "GROCERY",
    "status": "ACTIVE",
    "created_at": "2021-05-30 16:45:39",
    "deleted": false,
    "area": "Thiruverkadu"
  },
  {
    "id": 2,
    "name": "Sathyas Canteen",
    "category": "GROCERY",
    "status": "ACTIVE",
    "created_at": "2021-05-30 14:03:20",
    "deleted": true,
    "area": "Thiruverkadu"
  },
  {
    "id": 4,
    "name": "Sathyas Canteen",
    "category": "GROCERY",
    "status": "ACTIVE",
    "created_at": "2021-05-30 16:45:39",
    "deleted": false,
    "area": "Thiruverkadu"
  },
  {
    "id": 2,
    "name": "Sathyas Canteen",
    "category": "GROCERY",
    "status": "ACTIVE",
    "created_at": "2021-05-30 14:03:20",
    "deleted": true,
    "area": "Thiruverkadu"
  },
  {
    "id": 4,
    "name": "Sathyas Canteen",
    "category": "GROCERY",
    "status": "ACTIVE",
    "created_at": "2021-05-30 16:45:39",
    "deleted": false,
    "area": "Thiruverkadu"
  },
  {
    "id": 2,
    "name": "Sathyas Canteen",
    "category": "GROCERY",
    "status": "ACTIVE",
    "created_at": "2021-05-30 14:03:20",
    "deleted": true,
    "area": "Thiruverkadu"
  }
]
  isLoading = false;
  columns = [
    {name: 'Id', prop: 'id', sortable: false, width: 10}, 
    {name: 'Name', prop: 'name', sortable: false, width:50}, 
    {name: 'Category', prop: 'category', sortable: false, width:50}, 
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
      this.rows = this.rows2;
    })
    .catch(error => {
      this.isLoading = true;
      console.log(error)
    })
  }

}
