import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExtendedFormControl} from "../../../core/utils/extended-form-control.utils";
import {
  APP_ROUTES,
  BANK_ACCOUNT_NUMBER_REGEX,
  EMAIL_REGEX,
  GST_REGEX,
  IFSC_REGEX,
  MOBILE_REGEX,
  NAME_REGEX,
  PAN_REGEX
} from "../../../core/utils/constants.utils";
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
  readonly ADD_SHOP = APP_ROUTES.ADD_SHOP

  constructor(private fb: FormBuilder, private toastr: ToastrService, private shopService: ShopService,private route:ActivatedRoute, private router:Router) {
    this.current_route = this.router.url;
    this.shopDetailsForm = this.fb.group({
      shop_name: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX)], 'shop_name'),
      category: new ExtendedFormControl(null, [Validators.required], 'category'),
      description: new ExtendedFormControl('', [Validators.required,Validators.maxLength(150)], 'description'),
      mobile: new ExtendedFormControl('', [Validators.required, Validators.pattern(MOBILE_REGEX)], 'mobile'),
      telephone: new ExtendedFormControl('', [], 'telephone'),
      email: new ExtendedFormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)], 'email'),
      openingTime: new ExtendedFormControl('', [Validators.required], 'openingTime'),
      closingTime: new ExtendedFormControl('', [Validators.required], 'closingTime'),
      address_line_1: new ExtendedFormControl('', [Validators.required], 'address_line_1'),
      address_line_2: new ExtendedFormControl('', [Validators.required], 'address_line_2'),
      city: new ExtendedFormControl('', [Validators.required], 'city'),
      state: new ExtendedFormControl(null, [Validators.required], 'state'),
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
          return
        } else if (imgType == 'cover_photos' && this.coverImgSrcList.length >= 5) {
          this.toastr.error('Maximum of 5 cover photos can be uploaded')
        }

        const reader = new FileReader();
        reader.readAsDataURL(file[i]);
        reader.onload = () => {
          let img = new Image();
          let base64ImgSrc = reader.result as string;
          img.src = base64ImgSrc
          img.onload = () => {
            console.log(img.naturalHeight + " "+ img.naturalWidth)
            if(file[i].size/(1024*1024)>1){
              this.toastr.error('Image size must be less than 1 MB')
              return;
            }
            if (imgType == 'icon' && img.naturalWidth<=512 && img.naturalHeight<=512) {
              this.iconSrc = base64ImgSrc;
              this.iconName = file[i].name;
            } else if (imgType == 'cover_photos') {
              this.coverImgSrcList.push(base64ImgSrc)
              this.coverImgNameList.push(file[i].name)
            }else{
              this.toastr.error('Image height and width do not meet the required specifications')
            }
          };
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
      let index = this.coverImgNameList.findIndex(x => x == previewName)
      if(index>=0){
        this.coverImgNameList = this.coverImgNameList.filter(x => x != previewName)
        let deletedImgSrc = this.coverImgSrcList[index];
        this.coverImgSrcList = this.coverImgSrcList.filter(x => x != deletedImgSrc)
      }
      if(this.coverImgNameList.length == 0)
        setErrorMessage('Cover Photos cannot be empty', 'shopDetailsForm', 'cover_photos')
    }
  }

  beforeChange($event: NgbPanelChangeEvent) {
    Object.keys(this.shopDetailsForm.controls).forEach(field => {
      const control = this.shopDetailsForm.get(field);
      control.updateValueAndValidity();
      console.log('')
    });
    if ($event.panelId === 'photoPanel' && $event.nextState === false) {
      this.shopDetailsForm.get('icon').setValue('')
      this.shopDetailsForm.get('cover_photos').setValue('')
    }
  }

  canSubmitForm() {
    // if addShop check if the terms and condition box is set to true
    return true
    // return this.shopDetailsForm.valid && this.iconSrc.length > 0 && this.coverImgSrcList.length > 0
  }

  saveLater(){

  }
}
