import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {ToastrService} from 'ngx-toastr';

import {BaseComponent} from '../../../../base.component';
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';
import {APP_ROUTES, PRICE_REGEX, SHOP_NAME_REGEX} from '../../../../core/utils/constants.utils';
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
      this.breadCrumbData = [{label: 'Home', link: APP_ROUTES.DASHBOARD}, {label: 'Shop', link: APP_ROUTES.SHOP},
        {label: String(this.shopId), link: `${APP_ROUTES.SHOP}/${this.shopId}`}, {
          label: 'Item',
          link: `${APP_ROUTES.SHOP}/${this.shopId}${APP_ROUTES.ITEM}`
        },
        {label: String(this.itemId), link: ''}]
    });
    this.itemDetailsForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required, Validators.pattern(SHOP_NAME_REGEX)], 'name'),
      description: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'description'),
      item_type: new ExtendedFormControl(null, [Validators.required], 'item_type'),
      category: new ExtendedFormControl(null, [Validators.required], 'category'),
      status: new ExtendedFormControl(null, [Validators.required], 'status'),
      meta_data: this.fb.array([]),
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
            if (itemData['variants'].length > 0) {
              this.itemDetailsForm.get('variant_property').setValue(itemData['variants'][0]['reference_id'])
              for (let variant of itemData['variants'][0]['values']) {
                this.createFormArrayItem('variant_details', variant, true)
              }
            }
            break
          case 'icon':
            this.iconSrc = itemData[field]
            break;
          case 'cover_photos':
            this.coverImgSrcList = itemData[field]
            break;
          case 'filterable_fields':
            for (let filter of itemData['filterable_fields']) {
              this.createFormArrayItem('filterable_fields', filter);
            }
            break
          case 'meta_data':
            for (const data of Object.entries(itemData['meta_data'])) {
              this.createFormArrayItem('meta_data', data);
            }
            break
          default:
            if (field != 'id' && this.itemDetailsForm.get(field) != null) {
              this.itemDetailsForm.get(field).setValue(itemData[field])
            }
        }
      }
    })
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
          for (let i = 0; i < this.itemDetailsForm.value['meta_data'].length; i++)
            requestBody['meta_data'][this.itemDetailsForm.value['meta_data'][i]['key']] = this.itemDetailsForm.value['meta_data'][i]['value']
          break
        case 'filterable_fields':
          requestBody['filterable_fields'] = {}
          for (let i = 0; i < this.itemDetailsForm.value['filterable_fields'].length; i++)
            requestBody['filterable_fields'][this.itemDetailsForm.value['filterable_fields'][i]['filterName']] = this.itemDetailsForm.value['filterable_fields'][i]['filterValue']
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

  createFormArrayItem(type: string, data = {}, disabled = false) {
    let formGroup = null;
    switch (type) {
      case 'variant_details':
        if (this.itemDetailsForm.get('variant_property').value == null) {
          setErrorMessage('Variant property cannot be empty', 'item-details', 'variant_property')
          return;
        }
        this.variant_index = this.variant_index + 1
        formGroup = this.fb.group({
          variant_reference_id: new ExtendedFormControl({
            value: data['id'],
            disabled: disabled
          }, [], 'variant_reference_id'),
          variant_name: new ExtendedFormControl({
            value: data['value'],
            disabled: disabled
          }, [Validators.required], 'variant_name'),
          variant_price: new ExtendedFormControl({
            value: data['price']?.toFixed(2),
            disabled: disabled
          }, [Validators.required, Validators.pattern(PRICE_REGEX)], 'variant_price'),
          disableAdd: disabled,
          className: "variant_property-" + this.variant_index
        });
        break;

      case 'filterable_fields':
        this.filter_index = this.filter_index + 1
        formGroup = this.fb.group({
          filterName: new ExtendedFormControl({
            value: data['title'],
            disabled: disabled
          }, [Validators.required], 'filterName'),
          filterValue: new ExtendedFormControl({
            value: data['value'],
            disabled: disabled
          }, [Validators.required], 'filterValue'),
          className: "filter-" + this.filter_index
        })
        break;

      case 'meta_data':
        this.meta_index = this.meta_index + 1
        formGroup = this.fb.group({
          key: new ExtendedFormControl({value: data[0], disabled: disabled}, [Validators.required], 'key'),
          value: new ExtendedFormControl({value: data[1], disabled: disabled}, [Validators.required], 'value'),
          className: "meta-" + this.meta_index
        })
        break;
    }
    if (formGroup != null)
      (this.itemDetailsForm.get(type) as FormArray).push(formGroup);
  }

  deleteFormArrayItem(type: string, index: number): void {
    if (type == 'variant_details' && this.itemDetails['variants'].length > 0 && this.itemDetails['variants'][0]['values'][index] != null) {
      this.itemService.deleteVariant(this.shopId, this.itemId, this.itemDetails['variants'][0]['values'][index]['id'])
        .then(response => {
          this.loadItemDetailsForm(response['data']['item'])
        })
        .catch(error => {
          handleError(error, this.itemDetailsForm);
        })
    } else {
      let formArray = (this.itemDetailsForm.get(type) as FormArray);
      formArray.removeAt(index);
    }
  }

  getMeta() {
    this.itemService.getMeta()
      .then(response => {
        this.meta = response['data']
        this.item_types = Object.keys(this.meta)
      })
      .catch(error => {
        handleError(error, this.itemDetailsForm);
      });
  }

  getItemDetails() {
    this.itemService.getItemDetails(this.shopId, this.itemId)
      .then(response => {
        this.loadItemDetailsForm(response['data']['item'])
      })
      .catch(error => {
        console.log(error);
        handleError(error, this.itemDetailsForm)
      })
  }

  addVariant(index: number) {
    let variant_property = this.itemDetailsForm.get('variant_property').value
    if (variant_property != null) {
      let requestBody = {
        variant_name: variant_property,
        variant_value: (<FormArray>this.itemDetailsForm.get('variant_details')).at(index).get('variant_name').value,
        variant_price: (<FormArray>this.itemDetailsForm.get('variant_details')).at(index).get('variant_price').value
      }
      this.itemService.addNewVariant(this.shopId, this.itemId, requestBody)
        .then(response => {
          this.loadItemDetailsForm(response['data']['item'])
        })
        .catch(error => {
          handleError(error, this.itemDetailsForm);
        })
    }
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
