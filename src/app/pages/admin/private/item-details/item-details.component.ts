import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';
import {APP_ROUTES, PRICE_REGEX, SHOP_NAME_REGEX} from '../../../../core/utils/constants.utils';
import {handleError, setErrorMessage} from '../../../../core/utils/common.utils';
import $ from 'jquery';

import {ItemService} from '../../../../core/service/admin/item.service';
import {ToastrService} from 'ngx-toastr';

import {BaseComponent} from '../../../../base.component';
import {ReasonModalComponent} from "../../../../shared/reason-modal/reason-modal.component";

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent extends BaseComponent {
  breadCrumbData = [{label: 'Home', link: APP_ROUTES.DASHBOARD}, {label: 'Shops', link: APP_ROUTES.SHOP}]
  meta = new Map
  itemDetails = {}
  variantIndex = -1
  filterIndex = -1
  metaIndex = -1
  shopId: number
  itemId: string
  itemDetailsForm: FormGroup

  constructor(private fb: FormBuilder, private toastr: ToastrService, private route: ActivatedRoute, private itemService: ItemService,
              private router: Router, private modalService: NgbModal) {
    super()
    this.route.params.subscribe(params => {
      this.shopId = params['shop_id']
      this.itemId = params['id']
      this.breadCrumbData.push(
        {label: String(this.shopId), link: `${APP_ROUTES.SHOP}/${this.shopId}`},
        {label: 'Items', link: `${APP_ROUTES.SHOP}/${this.shopId}${APP_ROUTES.ITEM}`},
        {label: String(this.itemId), link: ''}
      )
    });
    this.itemDetailsForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required, Validators.pattern(SHOP_NAME_REGEX)], 'name'),
      description: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'description'),
      item_type: new ExtendedFormControl('', [Validators.required], 'item_type'),
      category: new ExtendedFormControl('', [Validators.required], 'category'),
      status: new ExtendedFormControl('', [Validators.required], 'status'),
      meta_data: this.fb.array([]),
      filterable_fields: this.fb.array([]),
      icon: new ExtendedFormControl('', [], 'icon'),
      cover_photos: new ExtendedFormControl('', [], 'cover_photos'),
      variant_property: new ExtendedFormControl('', [Validators.required], 'variant_property'),
      variant_details: this.fb.array([]),
      className: 'item-details'
    });
  }

  ngAfterViewInit(): void {
    this.getMeta()
  }

  getMeta() {
    this.itemService.getMeta()
      .then(response => {
        for (let config of response['data']) {
          if (!this.meta.has(config.item_type))
            this.meta.set(config.item_type, new Map)
          if (!this.meta.get(config.item_type).has(config.item_config))
            this.meta.get(config.item_type).set(config.item_config, new Map)
          this.meta.get(config.item_type).get(config.item_config).set(config.reference_id, config.title)
        }
        this.getItemDetails()
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
        handleError(error, this.itemDetailsForm)
      })
  }

  loadItemDetailsForm(itemData = {}) {
    this.itemDetails = itemData;
    (this.itemDetailsForm.get('variant_details') as FormArray).clear();
    (this.itemDetailsForm.get('meta_data') as FormArray).clear();
    (this.itemDetailsForm.get('filterable_fields') as FormArray).clear();
    this.itemDetailsForm.reset({className: 'item-details'})
    Object.keys(itemData).forEach(field => {
      if (itemData[field] != null) {
        switch (field) {
          case 'variants':
            if (itemData['variants'].length > 0) {
              this.itemDetailsForm.get('variant_property').setValue(itemData['variants'][0]['reference_id']);
              for (let variant of itemData['variants'])
                this.createFormArrayItem('variant_details', variant, true)
            }
            break
          case 'filterable_fields':
            for (let [reference_id, title] of this.meta?.get(itemData['item_type'])?.get('filter')) {
              let filterValue = itemData['filterable_fields']?.find(field => field.reference_id == reference_id)
              if (filterValue != null) {
                filterValue['title'] = title;
                this.createFormArrayItem('filterable_fields', filterValue, true);
              }
            }
            break
          case 'meta_data':
            for (const data of Object.entries(itemData['meta_data'])) {
              this.createFormArrayItem('meta_data', data);
            }
            break
          case 'category':
            this.itemDetailsForm.get(field)?.setValue(itemData[field]);
            break
          case 'icon':
          case 'cover_photos':
          case 'id':
            break;
          default:
            this.itemDetailsForm.get(field)?.setValue(itemData[field])
        }
      }
    })
  }

  submitItemDetails(accordion) {
    accordion.expandAll()
    let requestBody = {}
    for (const [key, value] of Object.entries(this.itemDetailsForm.value)) {
      switch (key) {
        case 'icon':
        case 'cover_photos':
        case 'status':
        case 'variant_details':
        case 'variant_property':
        case 'className':
          break
        case 'meta_data':
          requestBody['meta_data'] = {}
          for (let metaData of Object(value)) {
            requestBody['meta_data'][metaData['key']] = metaData['value']
          }
          break
        case 'filterable_fields':
          requestBody['filterable_fields'] = {}
          for (let filter of Object(value))
            requestBody['filterable_fields'][filter['filter_reference_id']] = filter['filter_value']
          break
        default:
          requestBody[key] = value
      }
    }

    this.itemService.updateItemDetails(this.shopId, this.itemId, requestBody)
      .then(response => {
        this.loadItemDetailsForm(response['data']['item'])
      })
      .catch(error => {
        this.updateError(error)
      })
  }

  deleteImage(imageId, imgType) {
    switch (imgType) {
      case 'icon':
        this.deleteIcon()
        this.itemService.deleteIcon(this.shopId, this.itemId)
          .then(response => {
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
            this.loadItemDetailsForm(response['data']['item'])
          })
          .catch(error => {
            handleError(error, this.itemDetailsForm)
          })
          .finally(() => {
            if (this.itemDetails['cover_photos'].length == 0)
              setErrorMessage('Cover Photos cannot be empty', 'item-details', 'cover_photos')
          })
        break;
    }
  }

  deleteIcon() {
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
      } else if (imgType == 'cover_photos' && this.itemDetails['cover_photos'].length >= 10) {
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
        this.variantIndex = this.variantIndex + 1
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
          className: `variant_property-${this.variantIndex}`
        });
        break;

      case 'filterable_fields':
        this.filterIndex = this.filterIndex + 1
        formGroup = this.fb.group({
          filter_name: new ExtendedFormControl({
            value: data['title'],
            disabled: disabled
          }, [Validators.required], 'filter_name'),
          filter_value: new ExtendedFormControl({
            value: data['value'],
            disabled: false
          }, [Validators.required], 'filter_value'),
          filter_reference_id: data['reference_id'],
          className: `filter-${this.filterIndex}`
        })
        break;

      case 'meta_data':
        this.metaIndex = this.metaIndex + 1
        formGroup = this.fb.group({
          key: new ExtendedFormControl({value: data[0], disabled: disabled}, [Validators.required], 'key'),
          value: new ExtendedFormControl({value: data[1], disabled: disabled}, [Validators.required], 'value'),
          className: `meta-${this.metaIndex}`
        })
        break;
    }
    if (formGroup != null)
      (this.itemDetailsForm.get(type) as FormArray).push(formGroup);
  }

  deleteFormArrayItem(type: string, index: number): void {
    switch (type) {
      case 'variant_details':
        if (this.itemDetails['variants'].length > 0 && this.itemDetails['variants'][index] != null) {
          this.itemService.deleteVariant(this.shopId, this.itemId, this.itemDetails['variants'][index]['id'])
            .then(response => {
              this.loadItemDetailsForm(response['data']['item'])
            })
            .catch(error => {
              handleError(error, this.itemDetailsForm);
            })
          return;
        }
        break;
    }

    let formArray = (this.itemDetailsForm.get(type) as FormArray);
    formArray.removeAt(index);
  }

  addVariant(index: number) {
    let variantProperty = this.itemDetailsForm.get('variant_property').value
    let variantValue = (<FormArray>this.itemDetailsForm.get('variant_details')).at(index).get('variant_name').value
    let variantPrice = (<FormArray>this.itemDetailsForm.get('variant_details')).at(index).get('variant_price').value
    if (variantProperty != null) {
      if (!this.itemDetailsForm.controls.variant_details['controls'][index].valid) {
        if (this.itemDetailsForm.controls.variant_details['controls'][index].get('variant_name').errors != null) {
          let error = {'error': {'reason': {'variant_name': ['Invalid Variant name']}}}
          handleError(error, this.itemDetailsForm.controls.variant_details['controls'][index])
        }

        if (this.itemDetailsForm.controls.variant_details['controls'][index].get('variant_price').errors != null) {
          let error = {'error': {'reason': {'variant_price': ['Invalid Variant price']}}}
          handleError(error, this.itemDetailsForm.controls.variant_details['controls'][index])
        }
        return
      }

      let requestBody = {
        variant_name: variantProperty,
        variant_value: variantValue,
        variant_price: variantPrice
      }
      this.itemService.addNewVariant(this.shopId, this.itemId, requestBody)
        .then(response => {
          this.loadItemDetailsForm(response['data']['item'])
        })
        .catch(error => {
          this.updateError(error)
        })
    }
  }

  updateItemStatus(status) {
    if (status == 'active') {
      if (this.itemDetails["variants"].length <= 0) {
        let error = {'error': {'reason': 'Variant value cannot be empty'}}
        handleError(error, this.itemDetailsForm)
        return
      }

      if (this.itemDetails["filterable_fields"].length <= 0) {
        let error = {'error': {'reason': 'Filterable Fields cannot be empty'}}
        handleError(error, this.itemDetailsForm)
        return
      }
    }

    let requestBody = {'status': status}
    this.itemService.updateItemDetails(this.shopId, this.itemId, requestBody)
      .then(response => {
        this.loadItemDetailsForm(response['data']['item'])
      })
      .catch(error => {
        this.updateError(error)
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

  updateError(error) {
    let reason = error['error']['reason'];
    if (reason != null) {
      if (typeof reason != 'string') {
        Object.entries(reason).forEach(([reasonKey, value]) => {
          if (Array.isArray(value) && ['variant_name', 'variant_value', 'filterable_fields'].includes(reasonKey)) {
            error['error']['reason'] = error['error']['reason'][reasonKey].join(', ')
            handleError(error, this.itemDetailsForm);
          }
        });
      }
    }
  }

  canSubmitForm() {
    return this.itemDetailsForm.valid && this.itemDetails['icon'] && this.itemDetails['cover_photos'] &&
      this.itemDetails['icon'].length > 0 && this.itemDetails['cover_photos'].length > 0
  }
}
