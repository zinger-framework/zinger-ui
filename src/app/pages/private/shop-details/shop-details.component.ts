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
  form_status = ''
  shopDetailsForm: FormGroup;
  shopDetailsInitialValue = {}
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
    this.shopDetailsForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX)], 'name'),
      category: new ExtendedFormControl(null, [Validators.required], 'category'),
      description: new ExtendedFormControl('', [Validators.required,Validators.maxLength(250)], 'description'),
      tags: new ExtendedFormControl('', [Validators.required,Validators.maxLength(100)], 'tags'),
      mobile: new ExtendedFormControl('', [Validators.required, Validators.pattern(MOBILE_REGEX)], 'mobile'),
      telephone: new ExtendedFormControl('', [], 'telephone'),
      email: new ExtendedFormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)], 'email'),
      opening_time: new ExtendedFormControl('9:30', [Validators.required], 'opening_time'),
      closing_time: new ExtendedFormControl('21:30', [Validators.required], 'closing_time'),
      address_line_1: new ExtendedFormControl('', [Validators.required], 'address_line_1'),
      address_line_2: new ExtendedFormControl('', [Validators.required], 'address_line_2'),
      city: new ExtendedFormControl('', [Validators.required], 'city'),
      state: new ExtendedFormControl(null, [Validators.required], 'state'),
      pincode: new ExtendedFormControl('', [Validators.required,Validators.pattern(PINCODE_REGEX)], 'pincode'),
      latitude: new ExtendedFormControl('', [Validators.required,Validators.pattern(LATLNG_REGEX)], 'latitude'),
      longitude: new ExtendedFormControl('', [Validators.required,Validators.pattern(LATLNG_REGEX)], 'longitude'),
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
      this.form_type = 'NEW_SHOP'
      this.initializeForm(history.state['shop'])
    }else{
      this.form_type = 'UPDATE_SHOP'
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

  initializeForm(shopData){
    console.log("Got Shop data")
    console.log(shopData)
    Object.keys(shopData).forEach(field => {

      if(shopData[field]!=null){
        if(field=='address'){
          if(shopData['lat']!=0.0 && shopData['lng']!=0.0){
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
          this.shopDetailsForm.get('tags').setValue(shopData[field].toString())
        }
        else if(field=='status'){
          this.form_status = shopData[field]
        }
        else if(field=='id'){
          this.shopId = shopData[field]
        }else{
          if(this.shopDetailsForm.get(field)!=null)
            this.shopDetailsForm.get(field).setValue(shopData[field])
          else
            console.log("wrong field "+field)
        }
      }else{
        console.log("Null data: "+field+" "+shopData[field])
      }
    });
    this.shopDetailsInitialValue = this.shopDetailsForm.value
  }

  submitShopDetails() {
    let formData = this.shopDetailsForm.value
    formData['icon'] = this.iconSrc
    formData['cover_photos'] = this.coverImgSrcList
    console.log(this.shopDetailsForm.value)
    console.log("Submitted")

    let  requestBody = {}
    if(this.form_type=='NEW_SHOP'){
      Object.keys(this.shopDetailsForm.value).forEach(key => {
        if(key =='latitude'){
          requestBody['lat']  = this.shopDetailsForm.value[key]
        }else if(key =='longitude'){
          requestBody['lng']  = this.shopDetailsForm.value[key]
        }else if(key=='address_line_1'){
          requestBody['street']  = this.shopDetailsForm.value[key]
        }else if(key=='address_line_2'){
          requestBody['area']  = this.shopDetailsForm.value[key]
        }else if(key=='tags'){
          requestBody['tags']  = this.shopDetailsForm.value[key].split(',')
        } else if(key=='cover_photos' || key=='icon'){
          console.log('continue')
        } else{
          requestBody[key] = this.shopDetailsForm.value[key]
        }
      })
      console.log(requestBody)
    }else if(this.form_type=='UPDATE_SHOP'){
      Object.keys(this.shopDetailsForm.value).forEach(key => {
        if(this.shopDetailsInitialValue[key]!=this.shopDetailsForm.value[key]){
          if(key =='latitude'){
            requestBody['lat']  = this.shopDetailsForm.value[key]
          }else if(key =='longitude'){
            requestBody['lng']  = this.shopDetailsForm.value[key]
          }else if(key=='address_line_1'){
            requestBody['street']  = this.shopDetailsForm.value[key]
          }else if(key=='address_line_2'){
            requestBody['area']  = this.shopDetailsForm.value[key]
          }else if(key=='tags'){
            requestBody['tags']  = this.shopDetailsForm.value[key].split(',')
          } else if(key=='cover_photos' || key=='icon'){
            console.log('continue')
          } else{
            requestBody[key] = this.shopDetailsForm.value[key]
          }
        }
      })
    }
    this.shopService.updateShopDetails(this.shopId,requestBody)
      .then(response => console.log(response))
      .catch(error => console.log(error));
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
              formData.append("icon_file",file[i]);
              this.shopService.uploadIcon(this.shopId,formData)
                .then(response => {
                  this.iconSrc = response['data']['icon']
                  this.iconName = file[i].name;
                  console.log(" "+response['data']['icon'])
                })
                .catch(error => {
                  console.log(error)
                  this.toastr.error(error['error']['message'])
                })
            } else if (imgType == 'cover_photos' && img.naturalWidth==1024 && img.naturalHeight==500) {
              formData.append("cover_file",file[i]);
              this.shopService.uploadCover(this.shopId,formData)
                .then(response => {
                  this.coverImgSrcList = response['data']['cover_photos']
                  console.log(" "+response['data']['cover_photos'])
                })
                .catch(error => {
                  console.log(error)
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

  previewDeleted(previewName,type){
    if (type == 'icon') {
      this.shopService.deleteIcon(this.shopId)
        .then(response => {
          this.iconSrc = ''
          this.iconName = ''
          this.shopDetailsForm.get(type).setValue('')
          setErrorMessage('Icon cannot be empty', 'shopDetailsForm', 'icon')
        })
        .catch(error => this.toastr.error(error['message']))

    } else if (type == 'cover_photos') {
      this.shopDetailsForm.get(type).setValue('')
      let index = this.coverImgSrcList.findIndex(x => x == previewName)
      if(index>=0){
        this.shopService.deleteCover(this.shopId,index)
          .then(response => {
            this.coverImgNameList = this.coverImgNameList.filter(x => x != previewName)
            let deletedImgSrc = this.coverImgSrcList[index];
            this.coverImgSrcList = this.coverImgSrcList.filter(x => x != deletedImgSrc)
          })
          .catch(error => this.toastr.error(error['message']))
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
    if(this.form_type=='NEW_SHOP'){
      return true;
      // return this.termsAndCondition && this.shopDetailsForm.valid && this.iconSrc.length > 0 && this.coverImgSrcList.length > 0
    }
    else
      return true;
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
