import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shop-approval',
  templateUrl: './shop-approval.component.html',
  styleUrls: ['./shop-approval.component.css']
})
export class ShopApprovalComponent implements OnInit {

  active = 1;
  // iconSrc = '/assets/images/upload-image.png'
  iconSrc = null
  // coverImgSrcList = ['/assets/images/upload-image.png','/assets/images/upload-image.png','/assets/images/upload-image.png']
  coverImgSrcList = []
  shopApprovalStatus = 'REJECTED'
  constructor() { }

  ngOnInit(): void {
  }

  expandPanel(acc, panelId) {
    acc.isExpanded(panelId) ? acc.collapse(panelId) : acc.expand(panelId);
  }

  updateShopApproval(state){

  }

  isTerminalState(){
    return this.shopApprovalStatus=='DRAFT'
  }

}
