import {Component, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExtendedFormControl} from "../../../../core/utils/extended-form-control.utils";
import {APP_ROUTES} from "../../../../core/utils/constants.utils";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {BaseComponent} from "../../../../base.component";
import {ShopService} from "../../../../core/service/platform/shop.service";

@Component({
  selector: 'shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent extends BaseComponent {
  rejectShopForm: FormGroup;
  @ViewChild('rejectShop', {read: TemplateRef}) rejectShopModal: TemplateRef<any>;
  data = {'address': {}, 'payment': {}}
  shopId = 0
  breadCrumbData = [];

  constructor(private fb: FormBuilder, private modalService: NgbModal, private route: ActivatedRoute, private router: Router, private shopService: ShopService, private toastr: ToastrService) {
    super()
    this.route.params.subscribe(params => this.shopId = params['id']);
    this.breadCrumbData = [{label: 'Home', link: '/dashboard'}, {label: 'Shop', link: '/shops'}, {
      label: this.shopId,
      link: ''
    }]
    this.rejectShopForm = this.fb.group({
      reason: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'reason'),
      className: 'reject-shop'
    })
  }

  ngOnInit(): void {
    this.shopService.getShopDetails(this.shopId)
      .then(response => {
        response['data']['shop']['tags'] = response['data']['shop']['tags'].toString().replace(/,/g, ', ');
        this.data = response['data']['shop']
      })
      .catch(error => {
        this.toastr.error(error['error']['message']);
        // TODO Redirect to list of shops
        this.router.navigate([APP_ROUTES.DASHBOARD])
      })
  }

  updateShopStatus(status) {
    this.modalService.dismissAll();
    let requestBody = {status: status}
    if (status == 'REJECTED') requestBody['comment'] = this.rejectShopForm.get('reason').value;
    this.shopService.updateShopDetails(this.shopId, requestBody)
      .then(response => {
        response['data']['shop']['tags'] = response['data']['shop']['tags'].toString().replace(/,/g, ', ');
        this.data = response['data']['shop']
      })
      .catch(error => {
        this.toastr.error(error['error']['message'])
      });
  }

  getCommentModal() {
    this.modalService.open(this.rejectShopModal, {centered: true});
  }
}
