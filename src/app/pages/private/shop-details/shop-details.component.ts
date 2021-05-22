import {AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExtendedFormControl} from '../../../core/utils/extended-form-control.utils';
import {
  ALPHABET_REGEX,
  APP_ROUTES,
  BANK_ACCOUNT_NUMBER_REGEX,
  TAGS_REGEX,
  EMAIL_REGEX,
  GST_REGEX,
  IFSC_REGEX,
  LATLNG_REGEX,
  MOBILE_REGEX,
  NAME_REGEX,
  PAN_REGEX,
  PINCODE_REGEX,
  TELEPHONE_REGEX
} from '../../../core/utils/constants.utils';
import {NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import $ from 'jquery';
import {handleError, setErrorMessage} from '../../../core/utils/common.utils';
import {ShopService} from '../../../core/service/shop.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from '../../../base.component';


@Component({
  selector: 'app-shop',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent extends BaseComponent implements AfterViewChecked {
  formStatus = ''
  shopDetailsForm: FormGroup;
  shopDetailsInitialValue = {}
  termsAndCondition = false;
  categories = ['GROCERY', 'PHARMACY', 'RESTAURANT', 'OTHERS']
  states = ['Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Karnataka']
  iconSrc = ''
  iconName = ''
  coverImgSrcList = []
  coverImgNameList = []
  shopId: number;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private shopService: ShopService, private route: ActivatedRoute, private router:Router, private changeDetectorRef: ChangeDetectorRef) {
    super();
    this.route.params.subscribe(params => this.shopId = params['id']);
    this.shopDetailsForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX)], 'name'),
      category: new ExtendedFormControl(null, [Validators.required], 'category'),
      description: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'description'),
      tags: new ExtendedFormControl('', [Validators.required, Validators.pattern(TAGS_REGEX)], 'tags'),
      mobile: new ExtendedFormControl('', [Validators.required, Validators.pattern(MOBILE_REGEX)], 'mobile'),
      telephone: new ExtendedFormControl('', [Validators.pattern(TELEPHONE_REGEX)], 'telephone'),
      email: new ExtendedFormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)], 'email'),
      opening_time: new ExtendedFormControl('', [Validators.required], 'opening_time'),
      closing_time: new ExtendedFormControl('', [Validators.required], 'closing_time'),
      address_line_1: new ExtendedFormControl('', [Validators.required], 'address_line_1'),
      address_line_2: new ExtendedFormControl('', [Validators.required], 'address_line_2'),
      city: new ExtendedFormControl('', [Validators.required, Validators.pattern(ALPHABET_REGEX)], 'city'),
      state: new ExtendedFormControl(null, [Validators.required], 'state'),
      pincode: new ExtendedFormControl('', [Validators.required, Validators.pattern(PINCODE_REGEX)], 'pincode'),
      latitude: new ExtendedFormControl('', [Validators.required, Validators.pattern(LATLNG_REGEX)], 'latitude'),
      longitude: new ExtendedFormControl('', [Validators.required, Validators.pattern(LATLNG_REGEX)], 'longitude'),
      icon: new ExtendedFormControl('', [], 'icon'),
      cover_photos: new ExtendedFormControl('', [], 'cover_photos'),
      account_number: new ExtendedFormControl('', [Validators.required, Validators.pattern(BANK_ACCOUNT_NUMBER_REGEX)], 'account_number'),
      account_holder: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX)], 'account_holder'),
      account_ifsc: new ExtendedFormControl('', [Validators.required, Validators.pattern(IFSC_REGEX)], 'account_ifsc'),
      pan: new ExtendedFormControl('', [Validators.required, Validators.pattern(PAN_REGEX)], 'pan'),
      gst: new ExtendedFormControl('', [Validators.pattern(GST_REGEX)], 'gst'),
      className: 'shopDetailsForm'
    });

    if(history.state['shop']!=null){
      this.initializeForm(history.state['shop'])
    }else{
      this.shopService.getShopDetails(this.shopId)
        .then(response => this.initializeForm(response['data']['shop']))
        .catch(error => {
          this.toastr.error(error['error']['message']);
          this.router.navigate([APP_ROUTES.DASHBOARD])
        })
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked() {
    Object.keys(this.shopDetailsForm.controls).forEach(field => {
      const control = this.shopDetailsForm.get(field);
      control.updateValueAndValidity();
    });
    this.changeDetectorRef.detectChanges();
  }

  initializeForm(shopData) {
    Object.keys(shopData).forEach(field => {
      if (shopData[field] != null) {
        if (field == 'address') {
          if (shopData['lat'] != 0.0 && shopData['lng'] != 0.0) {
            this.shopDetailsForm.get('address_line_1').setValue(shopData[field]['street'])
            this.shopDetailsForm.get('address_line_2').setValue(shopData[field]['area'])
            this.shopDetailsForm.get('city').setValue(shopData[field]['city'])
            this.shopDetailsForm.get('state').setValue(shopData[field]['state'])
            this.shopDetailsForm.get('pincode').setValue(shopData[field]['pincode'])
            this.shopDetailsForm.get('latitude').setValue(shopData[field]['lat'])
            this.shopDetailsForm.get('longitude').setValue(shopData[field]['lng'])
          }
        }
        else if(field=='payment'){
          Object.keys(shopData[field]).forEach(payment_field => {
            if(shopData[field][payment_field]!=null && this.shopDetailsForm.get(payment_field)!=null)
              this.shopDetailsForm.get(payment_field).setValue(shopData[field][payment_field])
          })
        }
        else if(field=='icon'){
          this.iconSrc = shopData[field]
        }
        else if(field=='cover_photos' && shopData[field].length>0){
          this.coverImgSrcList = shopData[field]
        }
        else if(field=='tags'){
          let tagString = shopData[field].toString();
          tagString = tagString.replace(/,/g,', ');
          this.shopDetailsForm.get('tags').setValue(tagString);
        }
        else if(field=='status'){
          this.formStatus = shopData[field]
        }
        else if(field=='id'){
          this.shopId = shopData[field]
        }else{
          if (this.shopDetailsForm.get(field) != null) {
            this.shopDetailsForm.get(field).setValue(shopData[field])
          }
        }
      }
    });
    this.shopDetailsInitialValue = this.shopDetailsForm.value
  }

  browseFiles(imgType) {
    this.shopDetailsForm.get(imgType).markAsTouched();
    $('#' + imgType)[0].click();
  }

  onFileChange(event, imgType = '') {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files;
      for (let i = 0; i < event.target.files.length; i++) {
        if (!file[i].name.endsWith('jpg') && !file[i].name.endsWith('png') && !file[i].name.endsWith('jpeg')) {
          this.toastr.error('Please upload an image')
          return
        } else if (imgType == 'cover_photos' && this.coverImgSrcList.length >= 10) {
          this.toastr.error('Maximum of 5 cover photos can be uploaded')
        }

        let formData = new FormData();
        const reader = new FileReader();
        reader.readAsDataURL(file[i]);
        reader.onload = () => {
          let img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            if(file[i].size/(1024*1024)>1){
              this.toastr.error('Image size must be less than 1 MB')
              return;
            }
            if (imgType == 'icon' && img.naturalWidth==512 && img.naturalHeight==512) {
              formData.append('icon_file',file[i]);
              this.shopService.uploadIcon(this.shopId,formData)
                .then(response => {
                  this.iconSrc = response['data']['icon']
                  this.iconName = file[i].name;
                })
                .catch(error => {
                  this.toastr.error(error['error']['message'])
                })
            } else if (imgType == 'cover_photos' && img.naturalWidth==1024 && img.naturalHeight==500) {
              formData.append('cover_file',file[i]);
              this.shopService.uploadCover(this.shopId,formData)
                .then(response => {
                  this.coverImgSrcList = response['data']['cover_photos']
                })
                .catch(error => {
                  this.toastr.error(error['error']['message'])
                })
            }else{
              this.toastr.error('Image height and width do not meet the required specifications')
            }
          };
        };
      }
    }
  }

  deleteIcon(){
    this.iconSrc = ''
    this.iconName = ''
    this.shopDetailsForm.get('icon').setValue('')
    setErrorMessage('Icon cannot be empty', 'shopDetailsForm', 'icon')
  }

  deleteCoverImage(previewName,index){
    this.coverImgNameList = this.coverImgNameList.filter(x => x != previewName)
    let deletedImgSrc = this.coverImgSrcList[index];
    this.coverImgSrcList = this.coverImgSrcList.filter(x => x != deletedImgSrc)
  }

  previewDeleted(previewName,type){
    if (type == 'icon') {
      this.shopService.deleteIcon(this.shopId)
        .then(response => {
          this.deleteIcon()
        })
        .catch(error => {
          if(error['status']==404){
            this.deleteIcon()
          }
          this.toastr.error(error['error']['message'])
        })

    } else if (type == 'cover_photos') {
      this.shopDetailsForm.get(type).setValue('')
      let index = this.coverImgSrcList.findIndex(x => x == previewName)
      if (index >= 0) {
        this.shopService.deleteCover(this.shopId, index)
          .then(response => {
            this.deleteCoverImage(previewName,index)
          })
          .catch(error => {
            if(error['status']==404){
              this.deleteCoverImage(previewName,index)
            }
            this.toastr.error(error['error']['message'])
          })
      }
      if(this.coverImgNameList.length == 0)
        setErrorMessage('Cover Photos cannot be empty', 'shopDetailsForm', 'cover_photos')
    }
  }

  onAccordionExpandListener($event: NgbPanelChangeEvent) {
    if ($event.panelId === 'photoPanel' && $event.nextState === false) {
      this.shopDetailsForm.get('icon').setValue('')
      this.shopDetailsForm.get('cover_photos').setValue('')
      console.log("before expand called")
    }
  }

  canSubmitForm() {
    if (this.formStatus == 'DRAFT') {
      return this.termsAndCondition && this.shopDetailsForm.valid && this.iconSrc.length > 0 && this.coverImgSrcList.length > 0
    } else
      return true;
  }

  submitShopDetails() {
    let formData = this.shopDetailsForm.value
    formData['icon'] = this.iconSrc
    formData['cover_photos'] = this.coverImgSrcList
    let requestBody = {}
    if (this.formStatus == 'DRAFT') {
      Object.keys(this.shopDetailsForm.value).forEach(key => {
        requestBody = this.updateRequestBody(key,requestBody)
      })
    } else if (this.formStatus == 'VERIFIED') {
      Object.keys(this.shopDetailsForm.value).forEach(key => {
        if (this.shopDetailsInitialValue[key] != this.shopDetailsForm.value[key]) {
          requestBody = this.updateRequestBody(key,requestBody)
        }
      })
    }
    this.shopService.updateShopDetails(this.shopId, requestBody)
      .then(response => {
        this.initializeForm(response['data']['shop'])
      })
      .catch(error => handleError(error,this.shopDetailsForm));
  }

  updateRequestBody(key, requestBody){
    if (key == 'latitude') {
      requestBody['lat'] = this.shopDetailsForm.value[key]
    } else if (key == 'longitude') {
      requestBody['lng'] = this.shopDetailsForm.value[key]
    } else if (key == 'address_line_1') {
      requestBody['street'] = this.shopDetailsForm.value[key]
    } else if (key == 'address_line_2') {
      requestBody['area'] = this.shopDetailsForm.value[key]
    } else if (key == 'tags') {
      let temp = this.shopDetailsForm.value[key].replace(/, /g,',');
      requestBody['tags'] = temp.split(',')
      requestBody['tags'] = requestBody['tags'].filter(tag => tag!='')
    } else if (key == 'cover_photos' || key == 'icon' || key=='className') {
      // pass;
    } else {
      requestBody[key] = this.shopDetailsForm.value[key]
    }
    return requestBody;
  }

  acceptTermsAndConditions() {
    this.termsAndCondition = !this.termsAndCondition;
  }

  expandPanel(acc, panelId) {
    acc.isExpanded(panelId)?acc.collapse(panelId):acc.expand(panelId);
  }
}
