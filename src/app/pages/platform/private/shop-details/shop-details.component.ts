import {Component, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {APP_ROUTES} from "../../../../core/utils/constants.utils";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {BaseComponent} from "../../../../base.component";
import {ShopService} from "../../../../core/service/platform/shop.service";
import {handleError} from "../../../../core/utils/common.utils";
import {ReasonModalComponent} from "../../../../shared/reason-modal/reason-modal.component"

@Component({
  selector: 'shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent extends BaseComponent {
  data = {'address': {}, 'payment': {}, 'deleted_comments': []}
  shopId = 0
  breadCrumbData = []

  constructor(private fb: FormBuilder, private modalService: NgbModal, private route: ActivatedRoute, private router: Router, private shopService: ShopService, private toastr: ToastrService) {
    super()
    this.route.params.subscribe(params => this.shopId = params['id']);
    this.breadCrumbData = [{label: 'Home', link: '/dashboard'}, {label: 'Shop', link: '/shops'}, {
      label: this.shopId,
      link: ''
    }]
  }

  ngOnInit(): void {
    this.shopService.getShopDetails(this.shopId)
      .then(response => {
        response['data']['shop']['tags'] = response['data']['shop']['tags'].toString().replace(/,/g, ', ');
        this.data = response['data']['shop']
        // TODO -  Remove below line after API changes return deleted comments
        this.data['deleted_comments'] = []
      })
      .catch(error => {
        this.toastr.error(error['error']['message']);
        // TODO Redirect to list of shops
        this.router.navigate([APP_ROUTES.DASHBOARD])
      })
  }

  updateShopStatus(status, reasonForm = null) {
    let requestBody = {status: status}
    if (['REJECTED', 'BLOCKED'].includes(status)) requestBody['reason'] = reasonForm.get('reason').value;
    this.shopService.updateShopDetails(this.shopId, requestBody)
      .then(response => {
        response['data']['shop']['tags'] = response['data']['shop']['tags'].toString().replace(/,/g, ', ');
        this.data = response['data']['shop']
        this.modalService.dismissAll();
      })
      .catch(error => {
        this.modalService.hasOpenModals() ? handleError(error, reasonForm) : this.modalService.dismissAll()
      });
  }

  deleteShops(reasonForm) {
    // TODO @harsha - Reason for deletion must be sent in API request
    this.shopService.deleteShop(this.shopId)
      .then(response => {
        this.data['deleted'] = true
        this.modalService.dismissAll()
      })
      .catch(error => {
        this.modalService.hasOpenModals() ? handleError(error, reasonForm) : this.modalService.dismissAll()
      })
  }

  getReasonModal(reason) {
    const modalRef = this.modalService.open(ReasonModalComponent, {centered: true});
    modalRef.componentInstance.title = reason;
    modalRef.componentInstance.updateStatus.subscribe((data) => {
      switch (data['title']) {
        case 'Deletion':
          this.deleteShops(data['formObject']);
          break;
        case 'Rejection':
          this.updateShopStatus('REJECTED', data['formObject'])
          break;
        case 'Blocking':
          this.updateShopStatus('BLOCKED', data['formObject'])
          break;
      }
    })
  }
}
