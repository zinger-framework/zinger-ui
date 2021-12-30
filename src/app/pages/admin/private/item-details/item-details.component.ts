import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {BaseComponent} from '../../../../base.component';
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';
import {SHOP_NAME_REGEX} from '../../../../core/utils/constants.utils';
import {handleError, setErrorMessage} from '../../../../core/utils/common.utils';
import {ToastrService} from 'ngx-toastr';
import $ from 'jquery';

export class variant {
  group_name: string
  details: Map<string, number>
}

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent extends BaseComponent {
  breadCrumbData = [{label: 'Home', link: '/dashboard'}, {label: 'Shop', link: '/shop'}, {label: 'Item', link: ''}]
  itemDetailsForm: FormGroup
  details = {
    categories: ['Food', 'Fashion'],
    subCategories: {
                    'Food': ['North India', 'chinese', 'south india', 'beverages', 'dessert', 'biriyani', 'fast-food', 'kebab'], 
                    'Fashion': ['shirts', 'jackets', 'jeans', 'ethnic_wear', 'accessories', 'footwear', 'innerwear']
                   },
    variantProperty: {'Food': ['quantity', 'size'], 'Fashion': ['size', 'color']}

  }
  iconSrc = ''
  coverImgSrcList = []
  itemVariant: variant
  variantDetails: FormArray
  variant_index = -1
  
  constructor(private fb: FormBuilder, private toastr: ToastrService) { 
    super()
    this.itemDetailsForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required, Validators.pattern(SHOP_NAME_REGEX)], 'name'),
      description: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'description'),
      category: new ExtendedFormControl(null, [Validators.required], 'category'),
      sub_category: new ExtendedFormControl(null, [Validators.required], 'sub_category'),
      property: new ExtendedFormControl('', [Validators.required], 'property'),
      icon: new ExtendedFormControl('', [], 'icon'),
      cover_photos: new ExtendedFormControl('', [], 'cover_photos'),
      variant_property: new ExtendedFormControl(null, [Validators.required], 'variant_property'),
      variant_details: this.fb.array([ this.createVariantItem() ]),
      className: 'item-details'
    });
  }

  ngOnInit(): void {
  }

  submitItemDetails(accordion) {
  }

  deleteImage(imageId, imgType) {
    switch (imgType) {
      case 'icon':
        // this.shopService.deleteIcon(this.shopId)
        //   .then(response => {
        //     this.deleteIcon()
        //   })
        //   .catch(error => {
        //     if (error['status'] == 404) this.deleteIcon()
        //     handleError(error, this.shopDetailsForm)
        //   })
        break;
      case 'cover_photos':
        // this.shopService.deleteCoverPhoto(this.shopId, imageId)
        //   .then(response => {
        //     this.coverImgSrcList = response['data']['cover_photos']
        //   })
        //   .catch(error => {
        //     if (error['status'] == 404) this.coverImgSrcList = this.coverImgSrcList.filter(x => x['id'] != imageId)
        //     handleError(error, this.shopDetailsForm)
        //   })
        //   .finally(() => {
        //     if (this.coverImgSrcList.length == 0)
        //       setErrorMessage('Cover Photos cannot be empty', 'shop-details', 'cover_photos')
        //   })
        break;
    }
  }

  deleteIcon() {
    this.iconSrc = ''
    setErrorMessage('Icon cannot be empty', 'shop-details', 'icon')
  }

  browseFiles(imgType) {
    // if (this.shopStatus == 'BLOCKED') return this.handleBlockingError(imgType, 'upload')
    this.itemDetailsForm.get(imgType).markAsTouched();
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
              this.itemDetailsForm.get('icon').setValue('')
              if (img.naturalWidth == 512 && img.naturalHeight == 512) {
                formData.append('icon_file', file);
                // this.shopService.uploadIcon(this.shopId, formData)
                //   .then(response => {
                //     this.iconSrc = response['data']['icon']
                //   })
                //   .catch(error => {
                //     handleError(error, this.shopDetailsForm)
                //   })
              } else {
                this.toastr.error('Please upload a valid image file of 512 x 512 dimension')
              }
              break;
            case 'cover_photos':
              // The below line helps fileChange to be triggered when same photo is uploaded twice
              this.itemDetailsForm.get('cover_photos').setValue('')
              if (img.naturalWidth == 1024 && img.naturalHeight == 500) {
                formData.append('cover_file', file);
                // this.shopService.uploadCoverPhoto(this.shopId, formData)
                //   .then(response => {
                //     this.coverImgSrcList = response['data']['cover_photos']
                //   })
                //   .catch(error => {
                //     handleError(error, this.shopDetailsForm)
                //   })
              } else {
                this.toastr.error('Please upload a valid image file of 1024 x 500 dimension')
              }
              break;
          }
        };
      };
    }
  }

  createVariantItem(): FormGroup {
    this.variant_index = this.variant_index + 1
    return this.fb.group({
      // name1: ['', Validators.required],
      // price1: ['', Validators.required]
      name1: new ExtendedFormControl('', [Validators.required], 'name1'),
      price1: new ExtendedFormControl('', [Validators.required], 'price1'),
      className: "variant_property-" + this.variant_index
    });
  }

  addNewVariant(): void {
    this.variantDetails = this.itemDetailsForm.get('variant_details') as FormArray;
    this.variantDetails.push(this.createVariantItem());
    console.log(this.itemDetailsForm)
    console.log(this.itemDetailsForm.get('variant_details')['controls'][0]['controls'].className.value)
  }

  deleteVariant(i:number){
    const fa = (this.itemDetailsForm.get('variant_details')as FormArray);
    fa.removeAt(i);
    if(fa.length===0) this.createVariantItem();
  }

}

/*
Examples -  Item Name, Item 

Item:
- Item Name
- Item Description
- Item picture
- Item category - food, dress
- Item sub category - tiffen/lunch/tandoori, jeans/t-shirts
- Property - veg/non-veg, cotton
- Tags - fast-food, chinese
- Item Variant
    Variant Group Name - Size
    Variant Property - regular/medium/large, 36/ 28/ 40 
    Variant Price - 25/35/45
*/ 


