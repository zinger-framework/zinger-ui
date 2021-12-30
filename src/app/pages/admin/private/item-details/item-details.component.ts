import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {BaseComponent} from '../../../../base.component';
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';
import {SHOP_NAME_REGEX} from '../../../../core/utils/constants.utils';
import {handleError, setErrorMessage} from '../../../../core/utils/common.utils';
import {ToastrService} from 'ngx-toastr';
import $ from 'jquery';

// Add placeholder functions in itemdetails service
// Handle cases for new product and existing product
// Write functions to load data into form model
// Handle navigation from shop to items

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent extends BaseComponent {
  breadCrumbData = [{label: 'Home', link: '/dashboard'}, {label: 'Shop', link: '/shop'}, {label: 'Item', link: ''}]
  itemDetailsForm: FormGroup
  details = {
    types: ['Food', 'Fashion'],
    categories: {
                    'Food': ['North India', 'chinese', 'south india', 'beverages', 'dessert', 'biriyani', 'fast-food', 'kebab'], 
                    'Fashion': ['shirts', 'jackets', 'jeans', 'ethnic_wear', 'accessories', 'footwear', 'innerwear']
                   },
    variantProperty: {'Food': ['quantity', 'size'], 'Fashion': ['size', 'color']}

  }
  iconSrc = ''
  coverImgSrcList = []
  variantDetails: FormArray
  variant_index = -1
  attr_index = -1
  shopId: number
  itemId: number

  
  constructor(private fb: FormBuilder, private toastr: ToastrService, private route: ActivatedRoute,) { 
    super()
    this.route.params.subscribe(params => {
      this.shopId = params['shop_id']
      this.itemId = params['id']
      this.breadCrumbData = [{label: 'Home', link: '/dashboard'}, {label: 'Shop', link: '/shop'}, 
      {label: String(this.shopId), link: '/shop/'+this.shopId }, {label: 'Item', link: ''}]
    });
    this.itemDetailsForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required, Validators.pattern(SHOP_NAME_REGEX)], 'name'),
      description: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'description'),
      type: new ExtendedFormControl(null, [Validators.required], 'type'),
      category: new ExtendedFormControl(null, [Validators.required], 'category'),
      attributes: this.fb.array([ this.createFormArrayItem('attributes') ]),
      icon: new ExtendedFormControl('', [], 'icon'),
      cover_photos: new ExtendedFormControl('', [], 'cover_photos'),
      variant_property: new ExtendedFormControl(null, [Validators.required], 'variant_property'),
      variant_details: this.fb.array([ this.createFormArrayItem('variant_details') ]),
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
      this.deleteIcon()
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
        //       setErrorMessage('Cover Photos cannot be empty', 'item-details', 'cover_photos')
        //   })
        break;
    }
  }

  deleteIcon() {
    this.iconSrc = ''
    setErrorMessage('Icon cannot be empty', 'item-details', 'icon')
  }

  browseFiles(imgType) {
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

  createFormArrayItem(type: string): FormGroup {
    switch(type) {
      case 'variant_details': {
        this.variant_index = this.variant_index + 1
        return this.fb.group({
          variant_name: new ExtendedFormControl('', [Validators.required], 'variant_name'),
          variant_price: new ExtendedFormControl('', [Validators.required], 'variant_price'),
          className: "variant_property-" + this.variant_index
        });
      } break;

      case 'attributes': {
        this.attr_index = this.attr_index + 1
        return this.fb.group({
          attribute_name: new ExtendedFormControl('', [Validators.required], 'attribute_name'),
          attribute_value: new ExtendedFormControl('', [Validators.required], 'attribute_value'),
          className: "attr-" + this.attr_index
        })
      } break;
    }
  }

  addFormArrayItem(type: string): void {
    this.variantDetails = this.itemDetailsForm.get(type) as FormArray;
    this.variantDetails.push(this.createFormArrayItem(type));
  }

  deleteFormArrayItem(type: string, index: number): void {
    const fa = (this.itemDetailsForm.get(type) as FormArray);
    fa.removeAt(index);
    if(fa.length===0) this.createFormArrayItem(type);
  }

}
