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
import {ReasonModalComponent} from "../../../../shared/reason-modal/reason-modal.component"

@Component({
  selector: 'shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent extends BaseComponent {
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

  deleteShops(reasonForm){
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

  getReasonModal(reason){
    const modalRef = this.modalService.open(ReasonModalComponent, {centered: true});
    modalRef.componentInstance.title = reason;
    modalRef.componentInstance.updateStatus.subscribe((receivedEntry) => {
      switch (receivedEntry['title']) {
        case 'Deletion':
          this.deleteShops(receivedEntry['formObject']);
          break;
        case 'Rejection':
          this.updateShopStatus('REJECTED', receivedEntry['formObject'])
          break;
        case 'Blocking':
          this.updateShopStatus('BLOCKED', receivedEntry['formObject'])
          break;
      }
    })
  }
}
