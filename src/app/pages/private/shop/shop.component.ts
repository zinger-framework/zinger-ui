import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ExtendedFormControl} from "../../../core/utils/extended-form-control.utils";
import {
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

// https://www.itsolutionstuff.com/post/angular-8-image-upload-with-previewexample.html
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  addShopForm: FormGroup;
  categories = ['GROCERY','CAFE','RESTAURANT']
  states = ['Tamil Nadu','Kerala','Andhra Pradesh','Karnataka']
  iconSrc = ""
  iconName = ""
  coverImgSrcList = []
  coverImgNameList = []
  url: any = ''

  constructor(private fb: FormBuilder,private cdr: ChangeDetectorRef, private toastr: ToastrService) {
    this.addShopForm = this.fb.group({
      shop_name: new ExtendedFormControl('', [Validators.required, Validators.pattern(NAME_REGEX)], 'shop_name'),
      category: new ExtendedFormControl('', [Validators.required], 'category'),
      description: new ExtendedFormControl('', [Validators.required], 'description'),
      mobile: new ExtendedFormControl('', [Validators.required, Validators.pattern(MOBILE_REGEX)], 'mobile'),
      telephone: new ExtendedFormControl('', [],'telephone'),
      email: new ExtendedFormControl('', [Validators.required,Validators.pattern(EMAIL_REGEX)], 'email'),
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
      icon: new ExtendedFormControl('', [this.checkImageType()], 'icon'),
      cover_photos: new ExtendedFormControl('', [Validators.required,this.checkImageType()], 'cover_photos'),
      account_number: new ExtendedFormControl('', [Validators.required,Validators.pattern(BANK_ACCOUNT_NUMBER_REGEX)], 'account_number'),
      account_holder_name: new ExtendedFormControl('', [Validators.required,Validators.pattern(NAME_REGEX)], 'account_holder_name'),
      ifsc_code: new ExtendedFormControl('', [Validators.required,Validators.pattern(IFSC_REGEX)], 'ifsc_code'),
      pan_number: new ExtendedFormControl('', [Validators.required, Validators.pattern(PAN_REGEX)], 'pan_number'),
      gst_number: new ExtendedFormControl('', [Validators.pattern(GST_REGEX)], 'gst_number'),
      className: 'addShopForm'
    });
  }

  ngOnInit(): void {
  }

  addShop(){
  }

  onFileChange(event,imgType = '') {
    console.log(this.addShopForm.value)
    if(event.target.files && event.target.files.length) {
      const file = event.target.files;
      for (let i = 0; i < event.target.files.length; i++) {
        if(!file[i].name.endsWith('jpg') && !file[i].name.endsWith('png') && !file[i].name.endsWith('jpeg') ){
          this.toastr.error('Please upload an image')
          this.addShopForm.get(imgType).setValue('')
          return
        }
        const reader = new FileReader();
        reader.readAsDataURL(file[i]);
        reader.onload = () => {
          let base64ImgSrc = reader.result as string;
          if(imgType == 'icon'){
            this.iconSrc = base64ImgSrc;
            this.iconName = file[i].name;
          }
          else if(imgType == 'cover'){
            this.coverImgSrcList.push(base64ImgSrc)
            this.coverImgNameList.push(file[i].name)
            console.log(this.coverImgSrcList)
          }
          // this.myForm.patchValue({
          //   fileSource: reader.result
          // });
        };
      }
    }
  }

  uploadPhotos(){
  }

  previewDeleted(previewName,type){
    if(type =='icon'){
      this.iconSrc = ''
      this.iconName = ''
      this.addShopForm.get(type).setValue('')
    }else if(type == 'cover'){
      for(let i=0;i<this.coverImgNameList.length;i++){
        if(this.coverImgNameList[i] == previewName){
          this.coverImgNameList.pop()
          this.coverImgSrcList.pop()
        }
      }
    }
  }

  checkImageType() {
    return function ( control: FormControl ) {
      const file = control.value;
      if ( file ) {
        const extension = file.split('.')[1].toLowerCase();
        if ( extension.toLowerCase() !== 'jpg' && extension.toLowerCase() !== 'png' ) {
          return {requiredFileType: true};
        }
        return null;
      }
      return null;
    };
  }

  beforeChange($event: NgbPanelChangeEvent) {
    if ($event.panelId === 'photoPanel' && $event.nextState === false) {
      this.addShopForm.get('icon').setValue('')
      // this.addShopForm.get('value').setValue('')
    }
  }

}
