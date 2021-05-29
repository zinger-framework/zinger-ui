import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExtendedFormControl} from "../../../core/utils/extended-form-control.utils";
import {OTP_REGEX} from "../../../core/utils/constants.utils";

@Component({
  selector: 'shop-approval',
  templateUrl: './shop-approval.component.html',
  styleUrls: ['./shop-approval.component.css']
})
export class ShopApprovalComponent implements OnInit {

  active = 1;
  rejectShopRequestForm: FormGroup;
  iconSrc = '/assets/images/upload-image.png'
  coverImgSrcList = ['/assets/images/upload-image.png','/assets/images/upload-image.png','/assets/images/upload-image.png']
  @ViewChild('rejectShopRequest', {read: TemplateRef}) rejectShopRequestModal: TemplateRef<any>;
  shopApprovalStatus = 'PENDING'
  comments = [{'author':'Harsha','date': '12 Apr 2021,  5:50 PM','comment': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque autem dolorum fuga, id illo ipsam itaque laborum modi molestias necessitatibus perferendis placeat porro possimus tempora temporibus vel veniam. A ipsam, voluptates. Architecto asperiores culpa est excepturi facilis impedit inventore itaque laudantium non odio odit placeat quasi quod rerum, velit voluptates.'},
    {'author':'Jack','date': '13 May 2021,  5:50 PM','comment': 'Lorem ipsum dolor sit amet'},
    {'author':'Parker','date': '12 Dec 2021,  9:50 PM','comment': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque autem dolorum fuga, id illo ipsam itaque laborum modi molestias necessitatibus perferendis placeat porro possimus tempora temporibus vel veniam. A ipsam, voluptates. Architecto asperiores culpa est excepturi facilis impedit inventore itaque laudantium non odio odit placeat quasi quod rerum, velit voluptates.'}]

  breadCrumbData = [{label: 'Home',link: '/dashboard'},{label: 'Shop',link: '/shops'},{label: '1',link: ''}];

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.rejectShopRequestForm = this.fb.group({
      reason: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'reason'),
      className: 'rejectShopRequest'
    })
  }

  ngOnInit(): void {
  }

  expandPanel(acc, panelId) {
    acc.isExpanded(panelId) ? acc.collapse(panelId) : acc.expand(panelId);
  }

  updateShopApproval(state){
    this.modalService.dismissAll();
  }

  isTerminalState(){
    return ['DRAFT','REJECTED'].includes(this.shopApprovalStatus)
  }

  showRejectShopRequestModal(){
    this.modalService.open(this.rejectShopRequestModal, {centered: true});
  }
}
