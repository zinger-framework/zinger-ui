import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExtendedFormControl} from "../../../core/utils/extended-form-control.utils";
import {BANK_ACCOUNT_NUMBER_REGEX, EMAIL_REGEX, GST_REGEX, IFSC_REGEX, MOBILE_REGEX, NAME_REGEX, PAN_REGEX} from "../../../core/utils/constants.utils";
import {NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from "ngx-toastr";
import $ from 'jquery';
import {setErrorMessage} from "../../../core/utils/common.utils";
import {ShopService} from "../../../core/service/shop.service";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-shop',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent implements OnInit {
  current_route = ''
  shopDetailsForm: FormGroup;
  categories = ['GROCERY', 'CAFE', 'RESTAURANT']
  states = ['Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Karnataka']
  iconSrc = ''
  iconName = ''
  coverImgSrcList = []
  coverImgNameList = []
  url: any = ''

  constructor(private fb: FormBuilder, private toastr: ToastrService, private shopService: ShopService,private route:ActivatedRoute, private router:Router) {
    if(this.current_route=='/updateShop'){
      console.log("Fetch shop details")
    }
    this.shopDetailsForm = this.fb.group({
      shop_name: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX)], 'shop_name'),
      category: new ExtendedFormControl('', [Validators.required], 'category'),
      description: new ExtendedFormControl('', [Validators.required], 'description'),
      mobile: new ExtendedFormControl('', [Validators.required, Validators.pattern(MOBILE_REGEX)], 'mobile'),
      telephone: new ExtendedFormControl('', [], 'telephone'),
      email: new ExtendedFormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)], 'email'),
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
      icon: new ExtendedFormControl('', [], 'icon'),
      cover_photos: new ExtendedFormControl('', [], 'cover_photos'),
      account_number: new ExtendedFormControl('', [Validators.required, Validators.pattern(BANK_ACCOUNT_NUMBER_REGEX)], 'account_number'),
      account_holder_name: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX)], 'account_holder_name'),
      ifsc_code: new ExtendedFormControl('', [Validators.required, Validators.pattern(IFSC_REGEX)], 'ifsc_code'),
      pan_number: new ExtendedFormControl('', [Validators.required, Validators.pattern(PAN_REGEX)], 'pan_number'),
      gst_number: new ExtendedFormControl('', [Validators.pattern(GST_REGEX)], 'gst_number'),
      className: 'shopDetailsForm'
    });
  }

  ngOnInit(): void {
  }

  submitShopDetails() {
    let formData = this.shopDetailsForm.value
    formData['icon'] = this.iconSrc
    formData['cover_photos'] = this.coverImgSrcList
    if(this.current_route=='/addShop'){
      this.shopService.addNewShop(formData)
    }
    else if(this.current_route=='/updateShop'){
      this.shopService.updateShopDetails(formData)
    }
  }

  browseFiles(imgType) {
    this.shopDetailsForm.get(imgType).markAsTouched();
    $("#" + imgType)[0].click();
  }

  onFileChange(event, imgType = '') {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files;
      for (let i = 0; i < event.target.files.length; i++) {

        if (!file[i].name.endsWith('jpg') && !file[i].name.endsWith('png') && !file[i].name.endsWith('jpeg')) {
          this.toastr.error('Please upload an image')
          if (imgType == 'icon')
            this.shopDetailsForm.get(imgType).setValue('')
          return
        } else if (imgType == 'cover_photos' && this.coverImgSrcList.length >= 5) {
          this.toastr.error('Maximum of 5 cover photos can be uploaded')
        }

        const reader = new FileReader();
        reader.readAsDataURL(file[i]);
        reader.onload = () => {
          let base64ImgSrc = reader.result as string;
          if (imgType == 'icon') {
            this.iconSrc = base64ImgSrc;
            this.iconName = file[i].name;
          } else if (imgType == 'cover_photos') {
            this.coverImgSrcList.push(base64ImgSrc)
            this.coverImgNameList.push(file[i].name)
          }
        };
      }
    }
  }

  uploadPhotos(){
  }

  previewDeleted(previewName,type){
    if (type == 'icon') {
      this.iconSrc = ''
      this.iconName = ''
      this.shopDetailsForm.get(type).setValue('')
      setErrorMessage('Icon cannot be empty', 'shopDetailsForm', 'icon')
    } else if (type == 'cover_photos') {
      for (let i = 0; i < this.coverImgNameList.length; i++) {
        if (this.coverImgNameList[i] == previewName) {
          this.coverImgNameList.pop()
          this.coverImgSrcList.pop()
        }
      }
      if(this.coverImgNameList.length == 0)
        setErrorMessage('Cover Photos cannot be empty', 'shopDetailsForm', 'cover_photos')
    }
  }

  beforeChange($event: NgbPanelChangeEvent) {
    if ($event.panelId === 'photoPanel' && $event.nextState === false) {
      this.shopDetailsForm.get('icon').setValue('')
      this.shopDetailsForm.get('cover_photos').setValue('')
    }
  }

  canSubmitForm() {
    return true
    // return this.shopDetailsForm.valid && this.iconSrc.length > 0 && this.coverImgSrcList.length > 0
  }
}
