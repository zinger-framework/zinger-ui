import {Component} from '@angular/core';
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
  breadCrumbData = [{label: 'Home', link: APP_ROUTES.DASHBOARD}, {label: 'Shops', link: APP_ROUTES.SHOP}]
  data = {'address': {}, 'payment': {}, 'deleted_conversations': []}
  shopId = 0

  constructor(private fb: FormBuilder, private modalService: NgbModal, private route: ActivatedRoute, private router: Router, private shopService: ShopService, private toastr: ToastrService) {
    super()
    this.route.params.subscribe(params => {
      this.shopId = params['id']
      this.breadCrumbData.push(
        {label: String(this.shopId), link: ''}
      )
    });
  }

  ngOnInit(): void {
    this.shopService.getShopDetails(this.shopId)
      .then(response => {
        this.loadShopData(response)
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
        this.loadShopData(response)
        this.modalService.dismissAll();
      })
      .catch(error => {
        this.modalService.hasOpenModals() ? handleError(error, reasonForm) : this.modalService.dismissAll()
      });
  }

  deleteShop(reasonForm) {
    let requestBody = {id: this.shopId, reason: reasonForm.get('reason').value}
    this.shopService.deleteShop(requestBody)
      .then(response => {
        this.loadShopData(response)
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
          this.deleteShop(data['formObject']);
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

  loadShopData(response) {
    response['data']['shop']['tags'] = response['data']['shop']['tags'].toString().replace(/,/g, ', ');
    this.data = response['data']['shop']
  }
}
