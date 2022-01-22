import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {ToastrService} from 'ngx-toastr';

import {BaseComponent} from '../../../../base.component';
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';
import {APP_ROUTES, SHOP_NAME_REGEX} from '../../../../core/utils/constants.utils';
import {handleError, setErrorMessage} from '../../../../core/utils/common.utils';
import {ItemService} from '../../../../core/service/admin/item.service';
import $ from 'jquery';
import {ReasonModalComponent} from "../../../../shared/reason-modal/reason-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

// TODO store reference id in filterable fields
// TODO: Update only fields that have changed in submitItemDetails

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent extends BaseComponent {
  breadCrumbData = [{label: 'Home', link: '/dashboard'}, {label: 'Shop', link: '/shop'}, {label: 'Item', link: ''}]
  itemDetailsForm: FormGroup
  meta = {}
  itemDetails = {}
  iconSrc = ''
  coverImgSrcList = []
  variant_index = -1
  filter_index = -1
  meta_index = -1
  shopId: number
  itemId: string
  item_types = []

  constructor(private fb: FormBuilder, private toastr: ToastrService, private route: ActivatedRoute, private itemService: ItemService,
              private router: Router, private modalService: NgbModal) {
    super()
    this.route.params.subscribe(params => {
      this.shopId = params['shop_id']
      this.itemId = params['id']
      this.breadCrumbData = [{label: 'Home', link: '/dashboard'}, {label: 'Shop', link: '/shop'},
        {label: String(this.shopId), link: `/shop/${this.shopId}`}, {label: 'Item', link: `/shop/${this.shopId}/item`}
        , {label: String(this.itemId), link: ''}]
    });
    this.itemDetailsForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required, Validators.pattern(SHOP_NAME_REGEX)], 'name'),
      description: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'description'),
      item_type: new ExtendedFormControl(null, [Validators.required], 'item_type'),
      category: new ExtendedFormControl(null, [Validators.required], 'category'),
      status: new ExtendedFormControl(null, [Validators.required], 'status'),
      meta_data: this.fb.array([this.createFormArrayItem('meta_data')]),
      filterable_fields: this.fb.array([]),
      icon: new ExtendedFormControl('', [], 'icon'),
      cover_photos: new ExtendedFormControl('', [], 'cover_photos'),
      variant_property: new ExtendedFormControl(null, [Validators.required], 'variant_property'),
      variant_details: this.fb.array([]),
      className: 'item-details'
    });
  }

  ngAfterViewInit(): void {
    this.getMeta()
    this.getItemDetails()
  }

  loadItemDetailsForm(itemData = {}) {
    (this.itemDetailsForm.get('variant_details') as FormArray).clear();
    (this.itemDetailsForm.get('meta_data') as FormArray).clear();
    (this.itemDetailsForm.get('filterable_fields') as FormArray).clear();
    this.itemDetailsForm.reset({className: 'item-details'})
    Object.keys(itemData).forEach(field => {
      if (itemData[field] != null) {
        switch (field) {
          case 'variants':
            this.itemDetailsForm.get('variant_property').setValue(itemData['variants'][0]['reference_id'])
            for (var i = 0; i < itemData['variants'][0]['values'].length; i++) {
              let temp = this.itemDetailsForm.get('variant_details') as FormArray;
              temp.push(this.createFormArrayItem('variant_details'));
              (<FormArray>this.itemDetailsForm.get('variant_details')).at(i).get('variant_name').setValue(itemData['variants'][0]['values'][i]['value']);
              (<FormArray>this.itemDetailsForm.get('variant_details')).at(i).get('variant_price').setValue(itemData['variants'][0]['values'][i]['price']);
            }
            break
          case 'icon':
            this.iconSrc = itemData[field]
            break;
          case 'cover_photos':
            this.coverImgSrcList = itemData[field]
            break;
          case 'filterable_fields':
            for (var i = 0; i < itemData['filterable_fields'].length; i++) {
              this.addFormArrayItem('filterable_fields');
              (<FormArray>this.itemDetailsForm.get('filterable_fields')).at(i).get('filter_name').setValue(itemData['filterable_fields'][i]['title']);
              (<FormArray>this.itemDetailsForm.get('filterable_fields')).at(i).get('filter_value').setValue(itemData['filterable_fields'][i]['value']);
            }
            break
          case 'meta_data':
            i = 0;
            Object.keys(itemData['meta_data']).forEach(key => {
              this.addFormArrayItem('meta_data');
              (<FormArray>this.itemDetailsForm.get('meta_data')).at(i).get('key').setValue(key);
              (<FormArray>this.itemDetailsForm.get('meta_data')).at(i).get('value').setValue(itemData['meta_data'][key]);
              i++;
            })
            break
          default:
            if (field != 'id' && this.itemDetailsForm.get(field) != null) {
              this.itemDetailsForm.get(field).setValue(itemData[field])
            }
        }
      }
    })
    var temp = this.itemDetailsForm.get('variant_details') as FormArray;
    temp.push(this.createFormArrayItem('variant_details'));
    this.itemDetails = itemData
  }

  submitItemDetails(accordion) {
    accordion.expandAll()
    let requestBody = {}
    Object.keys(this.itemDetailsForm.value).forEach(key => {
      switch (key) {
        case 'icon':
        case 'cover_photos':
        case 'status':
        case 'variant_details':
        case 'className':
          break
        case 'meta_data':
          requestBody['meta_data'] = {}
          for (var i = 0; i < this.itemDetailsForm.value['meta_data'].length; i++)
            requestBody['meta_data'][this.itemDetailsForm.value['meta_data'][i]['key']] = this.itemDetailsForm.value['meta_data'][i]['value']
          break
        case 'filterable_fields':
          requestBody['filterable_fields'] = {}
          for (var i = 0; i < this.itemDetailsForm.value['filterable_fields'].length; i++)
            requestBody['filterable_fields'][this.itemDetailsForm.value['filterable_fields'][i]['filter_name']] = this.itemDetailsForm.value['filterable_fields'][i]['filter_value']
          break
        default:
          requestBody[key] = this.itemDetailsForm.value[key]
      }
    })

    this.itemService.updateItemDetails(this.shopId, this.itemId, requestBody)
      .then(response => {
        this.loadItemDetailsForm(response['data']['item'])
      })
      .catch(error => {
        if (error['status'] == 404) this.deleteIcon()
        handleError(error, this.itemDetailsForm)
      })
  }

  deleteImage(imageId, imgType) {
    switch (imgType) {
      case 'icon':
        this.deleteIcon()
        this.itemService.deleteIcon(this.shopId, this.itemId)
          .then(response => {
            // this.deleteIcon()
            this.loadItemDetailsForm(response['data']['item'])
          })
          .catch(error => {
            if (error['status'] == 404) this.deleteIcon()
            handleError(error, this.itemDetailsForm)
          })
        break;
      case 'cover_photos':
        this.itemService.deleteCoverPhoto(this.shopId, this.itemId, imageId)
          .then(response => {
            // this.coverImgSrcList = response['data']['cover_photos']
            this.loadItemDetailsForm(response['data']['item'])
          })
          .catch(error => {
            if (error['status'] == 404) this.coverImgSrcList = this.coverImgSrcList.filter(x => x['id'] != imageId)
            handleError(error, this.itemDetailsForm)
          })
          .finally(() => {
            if (this.coverImgSrcList.length == 0)
              setErrorMessage('Cover Photos cannot be empty', 'item-details', 'cover_photos')
          })
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
                this.itemService.uploadIcon(this.shopId, this.itemId, formData)
                  .then(response => {
                    // this.iconSrc = response['data']['icon']
                    this.loadItemDetailsForm(response['data']['item'])
                  })
                  .catch(error => {
                    handleError(error, this.itemDetailsForm)
                  })
              } else {
                this.toastr.error('Please upload a valid image file of 512 x 512 dimension')
              }
              break;
            case 'cover_photos':
              // The below line helps fileChange to be triggered when same photo is uploaded twice
              this.itemDetailsForm.get('cover_photos').setValue('')
              if (img.naturalWidth == 1024 && img.naturalHeight == 500) {
                formData.append('cover_file', file);
                this.itemService.uploadCoverPhoto(this.shopId, this.itemId, formData)
                  .then(response => {
                    // this.coverImgSrcList = response['data']['cover_photos']
                    this.loadItemDetailsForm(response['data']['item'])
                  })
                  .catch(error => {
                    handleError(error, this.itemDetailsForm)
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

  createFormArrayItem(type: string): FormGroup {
    switch (type) {
      case 'variant_details': {
        this.variant_index = this.variant_index + 1
        return this.fb.group({
          variant_name: new ExtendedFormControl('', [Validators.required], 'variant_name'),
          variant_price: new ExtendedFormControl('', [Validators.required], 'variant_price'),
          className: "variant_property-" + this.variant_index
        });
      }
        break;

      case 'filterable_fields': {
        this.filter_index = this.filter_index + 1
        return this.fb.group({
          filter_name: new ExtendedFormControl('', [Validators.required], 'filter_name'),
          filter_value: new ExtendedFormControl('', [Validators.required], 'filter_value'),
          className: "filter-" + this.filter_index
        })
      }
        break;

      case 'meta_data': {
        this.meta_index = this.meta_index + 1
        return this.fb.group({
          key: new ExtendedFormControl('', [Validators.required], 'key'),
          value: new ExtendedFormControl('', [Validators.required], 'value'),
          className: "meta-" + this.meta_index
        })
      }
        break;
    }
  }

  addFormArrayItem(type: string): void {
    var temp = this.itemDetailsForm.get(type) as FormArray
    temp.push(this.createFormArrayItem(type))

    switch (type) {
      case 'variant_details':
        if (this.itemDetailsForm.get('variant_property').value == null) {
          console.log('variant property cannot be empty')
        } else {
          let requestBody = {
            variant_name: this.itemDetailsForm.get('variant_property').value,
            variant_value: (<FormArray>this.itemDetailsForm.get('variant_details')).at(this.variant_index - 1).get('variant_name').value,
            variant_price: (<FormArray>this.itemDetailsForm.get('variant_details')).at(this.variant_index - 1).get('variant_price').value
          }
          this.itemService.addNewVariant(this.shopId, this.itemId, requestBody)
            .then(response => {
              this.loadItemDetailsForm(response['data']['item'])
            })
            .catch(error => {
              let reason = error['error']['reason']
              handleError(error, this.itemDetailsForm);
            })
        }
        break;
      default:
    }

  }

  deleteFormArrayItem(type: string, index: number): void {
    if (type == 'variant_details') {
      this.itemService.deleteVariant(this.shopId, this.itemId, this.itemDetails['variants'][0]['values'][index]['id'])
        .then(response => {
          this.loadItemDetailsForm(response['data']['item'])
        })
        .catch(error => {
          let reason = error['error']['reason']
          handleError(error, this.itemDetailsForm);
        })
    } else {
      const fa = (this.itemDetailsForm.get(type) as FormArray);
      fa.removeAt(index);
      if (fa.length === 0) this.createFormArrayItem(type);
    }
  }

  getMeta() {
    this.itemService.getMeta()
      .then(response => {
        this.meta = response['data']
        this.item_types = Object.keys(this.meta)
      })
      .catch(error => {
        let reason = error['error']['reason']
        handleError(error, this.itemDetailsForm);
      });
  }

  getItemDetails() {
    this.itemService.getItemDetails(this.shopId, this.itemId)
      .then(response => {
        this.loadItemDetailsForm(response['data']['item'])
      })
      .catch(error => {
        this.router.navigate([APP_ROUTES.DASHBOARD])
      })
  }

  updateItemStatus(status) {
    let requestBody = {'status': status}
    this.itemService.updateItemDetails(this.shopId, this.itemId, requestBody)
      .then(response => {
        this.loadItemDetailsForm(response['data']['item'])
      })
      .catch(error => {
        handleError(error, this.itemDetailsForm)
      })
  }

  deleteItem(reasonForm) {
    let requestBody = {id: this.itemId, reason: reasonForm.get('reason').value}
    this.itemService.deleteItem(this.shopId, requestBody)
      .then(response => {
        this.modalService.dismissAll()
        this.router.navigateByUrl(`${APP_ROUTES.SHOP}/${String(this.shopId)}${APP_ROUTES.ITEM}`)
      })
      .catch(error => {
        this.modalService.hasOpenModals() ? handleError(error, reasonForm) : this.modalService.dismissAll()
      })
  }

  getReasonModal() {
    const modalRef = this.modalService.open(ReasonModalComponent, {centered: true});
    modalRef.componentInstance.title = 'Deletion';
    modalRef.componentInstance.updateStatus.subscribe((data) => {
      this.deleteItem(data['formObject']);
    })
  }
}
