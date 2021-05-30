import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExtendedFormControl} from "../../../core/utils/extended-form-control.utils";
import {APP_ROUTES} from "../../../core/utils/constants.utils";
import {ActivatedRoute, Router} from "@angular/router";
import {PlatformShopService} from "../../../core/service/platform-shop.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'shop-approval',
  templateUrl: './shop-approval.component.html',
  styleUrls: ['./shop-approval.component.css']
})
export class ShopApprovalComponent implements OnInit {
  active = 1;
  rejectShopRequestForm: FormGroup;
  // STATUSES = { 'DRAFT' => 1, 'PENDING' => 2, 'ACTIVE' => 3, 'BLOCKED' => 4, 'REJECTED' => 5, 'INACTIVE' => 6 }
  @ViewChild('rejectShopRequest', {read: TemplateRef}) rejectShopRequestModal: TemplateRef<any>;
  data = {}
  shopId = 1
  breadCrumbData = [];

  constructor(private fb: FormBuilder, private modalService: NgbModal, private route: ActivatedRoute, private router: Router, private shopService: PlatformShopService, private toastr: ToastrService) {
    this.route.params.subscribe(params => this.shopId = params['id']);
    this.breadCrumbData = [{label: 'Home', link: '/dashboard'}, {label: 'Shop', link: '/shops'}, {
      label: this.shopId,
      link: ''
    }]
    this.rejectShopRequestForm = this.fb.group({
      reason: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'reason'),
      className: 'rejectShopRequest'
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
        this.router.navigate([APP_ROUTES.DASHBOARD])
      })
  }

  expandPanel(acc, panelId) {
    acc.isExpanded(panelId) ? acc.collapse(panelId) : acc.expand(panelId);
  }

  updateShopApproval(status) {
    this.modalService.dismissAll();
    let requestBody = {status: status}
    if (status == 'REJECTED') requestBody['comment'] = this.rejectShopRequestForm.get('reason').value;
    this.shopService.updateShopDetails(this.shopId, requestBody)
      .then(response => {
        response['data']['shop']['tags'] = response['data']['shop']['tags'].toString().replace(/,/g, ', ');
        this.data = response['data']['shop']
      })
      .catch(error => {
        this.toastr.error(error['error']['message'])
      });
  }

  isTerminalState() {
    return ['DRAFT', 'REJECTED'].includes(this.data['status'])
  }

  showRejectShopRequestModal() {
    this.modalService.open(this.rejectShopRequestModal, {centered: true});
  }
}
