import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExtendedFormControl} from "../../../core/utils/extended-form-control.utils";
import {EMAIL_REGEX, MOBILE_REGEX, NAME_REGEX} from "../../../core/utils/constants.utils";

// https://medium.com/@amcdnl/file-uploads-with-angular-reactive-forms-960fd0b34cb5

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  addShopForm: FormGroup;
  categories = ['GROCERY','CAFE','RESTAURANT']
  states = ['Tamil Nadu','Kerala','Andhra Pradesh','Karnataka']

  constructor(private fb: FormBuilder) {
    this.addShopForm = this.fb.group({
      shop_name: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX)], 'shop_name'),
      category: new ExtendedFormControl('', [Validators.required], 'category'),
      mobile: new ExtendedFormControl('', [Validators.required, Validators.pattern(MOBILE_REGEX)], 'mobile'),
      telephone: new ExtendedFormControl('', [],'telephone'),
      email: new ExtendedFormControl('', [Validators.required], 'email'),
      openingTime: new ExtendedFormControl('', [Validators.required], 'openingTime'),
      closingTime: new ExtendedFormControl('', [Validators.required], 'closingTime'),
      address_line_1: new ExtendedFormControl('', [Validators.required], 'address_line_1'),
      address_line_2: new ExtendedFormControl('', [Validators.required], 'address_line_2'),
      city: new ExtendedFormControl('', [Validators.required], 'city'),
      state: new ExtendedFormControl('', [Validators.required], 'state'),
      country: new ExtendedFormControl('', [Validators.required], 'country'),
      pincode: new ExtendedFormControl('', [Validators.required], 'pincode'),
      latitude: new ExtendedFormControl('', [Validators.required], 'latitude'),
      longitude: new ExtendedFormControl('', [Validators.required], 'longitude'),
      icon: new ExtendedFormControl(null, [Validators.required], 'icon'),
      cover_photos: new ExtendedFormControl(null, [Validators.required], 'cover_photos'),
      className: 'addShopForm'
    });
  }

  ngOnInit(): void {
  }

  addShop(){
  }
}
