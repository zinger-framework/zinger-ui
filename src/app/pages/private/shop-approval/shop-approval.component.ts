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
  constructor() { }

  ngOnInit(): void {
  }

}
