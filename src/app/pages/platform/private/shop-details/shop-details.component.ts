import {Component, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExtendedFormControl} from "../../../../core/utils/extended-form-control.utils";
import {APP_ROUTES} from "../../../../core/utils/constants.utils";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {BaseComponent} from "../../../../base.component";
import {ShopService} from "../../../../core/service/platform/shop.service";
import {handleError} from "../../../../core/utils/common.utils";

@Component({
  selector: 'shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent extends BaseComponent {
  rejectShopForm: FormGroup;
  deleteShopForm: FormGroup;
  @ViewChild('rejectShop', {read: TemplateRef}) rejectShopModal: TemplateRef<any>;
  @ViewChild('deleteShop', {read: TemplateRef}) deleteShopModal: TemplateRef<any>;
  data = {'address': {}, 'payment': {}}
  shopId = 0
  breadCrumbData = []
  buttonValue = ''

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
    this.deleteShopForm = this.fb.group({className: 'delete-shop'})
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

 // Remove the status keyword and make the button value dynamic
 // If active -> BLOCK, DELETE

  updateShopStatus(status) {
    let requestBody = {status: status}
    if (status == 'REJECTED') requestBody['reason'] = this.rejectShopForm.get('reason').value;
    this.shopService.updateShopDetails(this.shopId, requestBody)
      .then(response => {
        response['data']['shop']['tags'] = response['data']['shop']['tags'].toString().replace(/,/g, ', ');
        this.data = response['data']['shop']
        this.modalService.dismissAll();
      })
      .catch(error => {
        this.modalService.hasOpenModals() ? handleError(error, this.rejectShopForm) : this.modalService.dismissAll()
      });
  }

  deleteShops(){
    this.shopService.deleteShop(this.shopId)
    .then(response => {
      this.modalService.dismissAll()
    })
    .catch(error => {
      handleError(error, this.deleteShopForm)
    })
  }

  getCommentModal() {
    this.modalService.open(this.rejectShopModal, {centered: true});
  }

  getDeleteModal(){
    this.modalService.open(this.deleteShopModal, {centered: true});
  }
}
