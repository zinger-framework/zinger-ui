import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {BaseComponent} from "../../../../base.component";
import {ShopService} from "../../../../core/service/admin/shop.service";
import {APP_ROUTES} from "../../../../core/utils/constants.utils";

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent extends BaseComponent {
  constructor(private shopService: ShopService, private router: Router, private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {
  }
}
