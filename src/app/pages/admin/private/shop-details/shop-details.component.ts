import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {ToastrService} from 'ngx-toastr';
import {ShopService} from '../../../../core/service/admin/shop.service';
import {BaseComponent} from '../../../../base.component';
import $ from 'jquery';
import {handleError, setErrorMessage} from '../../../../core/utils/common.utils';
import {validateRange} from "../../../../core/utils/validators.utils";
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';
import {
  ALPHABET_REGEX,
  APP_ROUTES,
  BANK_ACCOUNT_NUMBER_REGEX,
  EMAIL_REGEX,
  GST_REGEX,
  IFSC_REGEX,
  LATLNG_REGEX,
  MOBILE_REGEX,
  NAME_REGEX,
  PAN_REGEX,
  PINCODE_REGEX,
  SHOP_NAME_REGEX,
  TAGS_REGEX,
  TELEPHONE_REGEX
} from '../../../../core/utils/constants.utils';

@Component({
  selector: 'app-shop',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent extends BaseComponent {
  formStatus = ''
  shopDetailsForm: FormGroup;
  shopDetailsInitialValue = {}
  termsAndCondition = false;
  categories = ['GROCERY', 'PHARMACY', 'RESTAURANT', 'OTHERS']
  states = ['Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Karnataka']
  iconSrc = ''
  coverImgSrcList = []
  rejectedConversations = []
  blockedConversations = []
  shopId: number;
  breadCrumbData = [{label: 'Home', link: '/dashboard'}, {label: 'Shop', link: ''}];
  isShopActive: boolean = false;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private shopService: ShopService, private route: ActivatedRoute, private router: Router) {
    super();
    this.route.params.subscribe(params => this.shopId = params['id']);
    this.shopDetailsForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required, Validators.pattern(SHOP_NAME_REGEX)], 'name'),
      category: new ExtendedFormControl(null, [Validators.required], 'category'),
      description: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'description'),
      tags: new ExtendedFormControl('', [Validators.required, Validators.pattern(TAGS_REGEX)], 'tags'),
      mobile: new ExtendedFormControl('', [Validators.required, Validators.pattern(MOBILE_REGEX)], 'mobile'),
      telephone: new ExtendedFormControl('', [Validators.pattern(TELEPHONE_REGEX)], 'telephone'),
      email: new ExtendedFormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)], 'email'),
      opening_time: new ExtendedFormControl('', [Validators.required], 'opening_time'),
      closing_time: new ExtendedFormControl('', [Validators.required], 'closing_time'),
      address_line_1: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'address_line_1'),
      address_line_2: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'address_line_2'),
      city: new ExtendedFormControl('', [Validators.required, Validators.pattern(ALPHABET_REGEX)], 'city'),
      state: new ExtendedFormControl(null, [Validators.required], 'state'),
      pincode: new ExtendedFormControl('', [Validators.required, Validators.pattern(PINCODE_REGEX)], 'pincode'),
      latitude: new ExtendedFormControl('', [Validators.required, Validators.pattern(LATLNG_REGEX), validateRange(-90, 90)], 'latitude'),
      longitude: new ExtendedFormControl('', [Validators.required, Validators.pattern(LATLNG_REGEX), validateRange(-180, 180)], 'longitude'),
      icon: new ExtendedFormControl('', [], 'icon'),
      cover_photos: new ExtendedFormControl('', [], 'cover_photos'),
      account_number: new ExtendedFormControl('', [Validators.required, Validators.pattern(BANK_ACCOUNT_NUMBER_REGEX)], 'account_number'),
      account_holder: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX), Validators.minLength(4), Validators.maxLength(35)], 'account_holder'),
      account_ifsc: new ExtendedFormControl('', [Validators.required, Validators.pattern(IFSC_REGEX)], 'account_ifsc'),
      pan: new ExtendedFormControl('', [Validators.required, Validators.pattern(PAN_REGEX)], 'pan'),
      gst: new ExtendedFormControl('', [Validators.pattern(GST_REGEX)], 'gst'),
      className: 'shop-details'
    });
  }

  ngOnInit(): void {
    if (history.state['shop'] != null) {
      this.initializeForm(history.state['shop'])
    } else {
      this.getShopDetails();
    }
  }

  initializeForm(shopData) {
    Object.keys(shopData).forEach(field => {
      if (shopData[field] != null) {
        switch (field) {
          case 'address':
            if (shopData[field]['lat'] != 0 && shopData[field]['lng'] != 0) {
              this.shopDetailsForm.get('latitude').setValue(shopData[field]['lat'])
              this.shopDetailsForm.get('longitude').setValue(shopData[field]['lng'])
            }
            this.shopDetailsForm.get('address_line_1').setValue(shopData[field]['street'])
            this.shopDetailsForm.get('address_line_2').setValue(shopData[field]['area'])
            this.shopDetailsForm.get('city').setValue(shopData[field]['city'])
            this.shopDetailsForm.get('state').setValue(shopData[field]['state'])
            this.shopDetailsForm.get('pincode').setValue(shopData[field]['pincode'])
            break;
          case 'payment':
            Object.keys(shopData[field]).forEach(payment_field => {
              if (shopData[field][payment_field] != null)
                this.shopDetailsForm.get(payment_field).setValue(shopData[field][payment_field])
            })
            break;
          case 'icon':
            this.iconSrc = shopData[field]
            break;
          case 'cover_photos':
            if (shopData[field].length > 0) {
              this.coverImgSrcList = shopData[field]
            }
            break;
          case 'tags':
            let tagString = shopData[field].toString().replace(/,/g, ', ');
            this.shopDetailsForm.get('tags').setValue(tagString);
            break;
          case 'status':
            this.formStatus = shopData[field]
            if (this.formStatus == 'ACTIVE') this.isShopActive = true;
            break;
          case 'rejected_conversations':
            this.rejectedConversations = shopData[field]
            break;
          case 'blocked_conversations':
            this.blockedConversations = shopData[field]
            break;
          default:
            if (field != 'id' && this.shopDetailsForm.get(field) != null) {
              this.shopDetailsForm.get(field).setValue(shopData[field])
            }
        }
      }
    });
    this.shopDetailsInitialValue = this.shopDetailsForm.value
  }

  browseFiles(imgType) {
    if (this.formStatus == 'BLOCKED') {
      let errorMsg = {'error': {'reason': {}}}
      errorMsg['error']['reason'][imgType] = ['Image upload is disabled as your shop is blocked']
      return handleError(errorMsg, this.shopDetailsForm)
    }
    this.shopDetailsForm.get(imgType).markAsTouched();
    $(`div.form-group-${imgType} input`)[0].click();
  }

  onFileChange(event, imgType) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (!file.name.endsWith('jpg') && !file.name.endsWith('png') && !file.name.endsWith('jpeg')) {
        this.toastr.error('Please upload a valid image file')
        return;
      } else if (imgType == 'cover_photos' && this.coverImgSrcList.length >= 10) {
        this.toastr.error('You have already uploaded 10 images. Please contact Zinger team to increase limit')
        return;
      }

      let formData = new FormData();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          if (file.size / (1024 * 1024) > 1) {
            this.toastr.error('Please upload an image file of less than 1 MB')
            return;
          }
          switch (imgType) {
            case 'icon':
              this.shopDetailsForm.get('icon').setValue('')
              if (img.naturalWidth == 512 && img.naturalHeight == 512) {
                formData.append('icon_file', file);
                this.shopService.uploadIcon(this.shopId, formData)
                  .then(response => {
                    this.iconSrc = response['data']['icon']
                  })
                  .catch(error => {
                    handleError(error, this.shopDetailsForm)
                  })
              } else {
                this.toastr.error('Please upload a valid image file of 512 x 512 dimension')
              }
              break;
            case 'cover_photos':
              // The below line helps fileChange to be triggered when same photo is uploaded twice
              this.shopDetailsForm.get('cover_photos').setValue('')
              if (img.naturalWidth == 1024 && img.naturalHeight == 500) {
                formData.append('cover_file', file);
                this.shopService.uploadCoverPhoto(this.shopId, formData)
                  .then(response => {
                    this.coverImgSrcList = response['data']['cover_photos']
                  })
                  .catch(error => {
                    handleError(error, this.shopDetailsForm)
                  })
              } else {
                this.toastr.error('Please upload a valid image file of 1024 x 500 dimension')
              }
              break;
          }
        };
      };
    }
  }

  deleteImage(imageId, imgType) {
    if (this.formStatus == 'BLOCKED') {
      let errorMsg = {'error': {'reason': {}}}
      errorMsg['error']['reason'][imgType] = ['Image deletion is disabled as your shop is blocked']
      return handleError(errorMsg, this.shopDetailsForm) 
    }
    switch (imgType) {
      case 'icon':
        this.shopService.deleteIcon(this.shopId)
          .then(response => {
            this.deleteIcon()
          })
          .catch(error => {
            if (error['status'] == 404) this.deleteIcon()
            handleError(error, this.shopDetailsForm)
          })
        break;
      case 'cover_photos':
        this.shopService.deleteCoverPhoto(this.shopId, imageId)
          .then(response => {
            this.coverImgSrcList = response['data']['cover_photos']
          })
          .catch(error => {
            if (error['status'] == 404) this.coverImgSrcList = this.coverImgSrcList.filter(x => x['id'] != imageId)
            handleError(error, this.shopDetailsForm)
          })
          .finally(() => {
            if (this.coverImgSrcList.length == 0)
              setErrorMessage('Cover Photos cannot be empty', 'shop-details', 'cover_photos')
          })
        break;
    }
  }

  deleteIcon() {
    this.iconSrc = ''
    setErrorMessage('Icon cannot be empty', 'shop-details', 'icon')
  }

  canSubmitForm() {
    let submitStatus = this.shopDetailsForm.valid && this.iconSrc.length > 0 && this.coverImgSrcList.length > 0 && this.formStatus != 'BLOCKED'
    return (this.formStatus == 'DRAFT') ? this.termsAndCondition && submitStatus : submitStatus
  }

  submitShopDetails(accordion) {
    accordion.expandAll()
    let requestBody = {}
    switch (this.formStatus) {
      case 'DRAFT':
        Object.keys(this.shopDetailsForm.value).forEach(key => {
          requestBody = this.updateRequestBody(key, requestBody)
        })
        break;
      default:
        Object.keys(this.shopDetailsForm.value).forEach(key => {
          if (this.shopDetailsInitialValue[key] != this.shopDetailsForm.value[key]) {
            requestBody = this.updateRequestBody(key, requestBody)
          }
        })
        break;
    }

    this.updateShopDetails(requestBody)
  }

  updateRequestBody(key, requestBody) {
    if (['cover_photos', 'icon', 'className'].includes(key))
      return requestBody;

    switch (key) {
      case 'latitude':
        requestBody['lat'] = this.shopDetailsForm.value[key];
        break;
      case 'longitude':
        requestBody['lng'] = this.shopDetailsForm.value[key];
        break;
      case 'address_line_1':
        requestBody['street'] = this.shopDetailsForm.value[key];
        break;
      case 'address_line_2':
        requestBody['area'] = this.shopDetailsForm.value[key];
        break;
      case 'tags':
        requestBody['tags'] = this.shopDetailsForm.value[key].replace(/, /g, ',').split(',').filter(tag => tag != '');
        break;
      default:
        requestBody[key] = this.shopDetailsForm.value[key]
    }
    return requestBody;
  }

  acceptTermsAndConditions() {
    this.termsAndCondition = !this.termsAndCondition;
  }

  getShopDetails() {
    this.shopService.getShopDetails(this.shopId)
      .then(response => this.initializeForm(response['data']['shop']))
      .catch(error => {
        this.router.navigate([APP_ROUTES.DASHBOARD])
      })
  }

  updateShopActiveStatus() {
    this.isShopActive = !this.isShopActive;
    let requestBody = {}
    requestBody['status'] = this.formStatus == 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    this.updateShopDetails(requestBody, {resetStatus: true})
  }

  updateShopDetails(requestBody, options = {}) {
    this.shopService.updateShopDetails(this.shopId, requestBody)
      .then(response => {
        this.initializeForm(response['data']['shop']);
      })
      .catch(error => {
        // TODO: navigate to list of shops
        if (error['status'] == 404) this.router.navigateByUrl(APP_ROUTES.DASHBOARD);
        if (options['resetStatus'] && options['resetStatus'] == true) this.isShopActive = !this.isShopActive;
        handleError(error, this.shopDetailsForm);
      })
  }
}
