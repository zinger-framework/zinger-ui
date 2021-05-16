import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExtendedFormControl} from "../../../core/utils/extended-form-control.utils";
import {
  APP_ROUTES,
  BANK_ACCOUNT_NUMBER_REGEX,
  EMAIL_REGEX,
  GST_REGEX,
  IFSC_REGEX, LATLNG_REGEX,
  MOBILE_REGEX,
  NAME_REGEX,
  PAN_REGEX, PINCODE_REGEX
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
  form_type = ''
  shopDetailsForm: FormGroup;
  termsAndCondition = false;
  categories = ['GROCERY', 'PHARMACY', 'RESTAURANT','OTHERS']
  states = ['Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Karnataka']
  iconSrc = ''
  iconName = ''
  coverImgSrcList = []
  coverImgNameList = []
  url: any = ''
  shopId: number;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private shopService: ShopService,private zone: NgZone,private route: ActivatedRoute, private router:Router) {
    this.route.params.subscribe(params => this.shopId = params['id']);
    if(history.state['shop']!=null){
      this.form_type = 'NEW_SHOP'
      this.initializeForm(history.state['shop'])
    }else{
      this.form_type = 'UPDATE_SHOP'
      this.shopService.getShopDetails(this.shopId)
        .then(response => this.initializeForm(response['data']))
        .catch(error => {
          this.toastr.error(error['error']['message']);
          this.router.navigate([APP_ROUTES.DASHBOARD])
        })
    }

    this.shopDetailsForm = this.fb.group({
      shop_name: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX)], 'shop_name'),
      category: new ExtendedFormControl(null, [Validators.required], 'category'),
      description: new ExtendedFormControl('', [Validators.required,Validators.maxLength(250)], 'description'),
      tags: new ExtendedFormControl('', [Validators.required,Validators.maxLength(100)], 'tags'),
      mobile: new ExtendedFormControl('', [Validators.required, Validators.pattern(MOBILE_REGEX)], 'mobile'),
      telephone: new ExtendedFormControl('', [], 'telephone'),
      email: new ExtendedFormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)], 'email'),
      openingTime: new ExtendedFormControl('9:30 AM', [Validators.required], 'openingTime'),
      closingTime: new ExtendedFormControl('9:30 PM', [Validators.required], 'closingTime'),
      address_line_1: new ExtendedFormControl('', [Validators.required], 'address_line_1'),
      address_line_2: new ExtendedFormControl('', [Validators.required], 'address_line_2'),
      city: new ExtendedFormControl('', [Validators.required], 'city'),
      state: new ExtendedFormControl(null, [Validators.required], 'state'),
      country: new ExtendedFormControl('', [Validators.required], 'country'),
      pincode: new ExtendedFormControl('', [Validators.required,Validators.pattern(PINCODE_REGEX)], 'pincode'),
      latitude: new ExtendedFormControl('', [Validators.required,Validators.pattern(LATLNG_REGEX)], 'latitude'),
      longitude: new ExtendedFormControl('', [Validators.required,Validators.pattern(LATLNG_REGEX)], 'longitude'),
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

  initializeForm(shopData){
    console.log("Got Shop data")
    console.log(shopData)
  }

  submitShopDetails() {
    let formData = this.shopDetailsForm.value
    formData['icon'] = this.iconSrc
    formData['cover_photos'] = this.coverImgSrcList
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

        let formData = new FormData();
        formData.append("icon_file",file[i]);
        formData.append("icon_file2",'test');
        this.shopService.uploadIcon(this.shopId,formData)
          .then(response => {
            console.log(response)
          })
          .then(error => {
            console.log(error)
          })

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
            if (imgType == 'icon' && img.naturalWidth==512 && img.naturalHeight==512) {
              this.iconSrc = base64ImgSrc;
              this.iconName = file[i].name;
            } else if (imgType == 'cover_photos' && img.naturalWidth==1024 && img.naturalHeight==500) {
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
      this.shopDetailsForm.get(type).setValue('')
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

  beforeChange($event: NgbPanelChangeEvent, acc) {
    if ($event.panelId === 'photoPanel' && $event.nextState === false) {
      this.shopDetailsForm.get('icon').setValue('')
      this.shopDetailsForm.get('cover_photos').setValue('')
    }
  }

  canSubmitForm() {
    // if addShop check if the terms and condition box is set to true
    if(this.form_type=='NEW_SHOP'){
      return true && this.termsAndCondition
    }
    else
      return true;
    // return this.shopDetailsForm.valid && this.iconSrc.length > 0 && this.coverImgSrcList.length > 0
  }

  saveLater(){
  }

  acceptTermsAndConditions(){
    this.termsAndCondition = !this.termsAndCondition;
  }

  expandPanel(acc,panelId){
    if(acc.isExpanded(panelId)){
      acc.collapse(panelId)
    }
    else{
      acc.expand(panelId)
      this.zone.onMicrotaskEmpty.asObservable().pipe()
        .subscribe(() => {
          Object.keys(this.shopDetailsForm.controls).forEach(field => {
            const control = this.shopDetailsForm.get(field);
            control.updateValueAndValidity();
          });
        });
    }
  }
}
