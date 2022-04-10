import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';
import {APP_ROUTES, PRICE_REGEX, SHOP_NAME_REGEX} from '../../../../core/utils/constants.utils';
import {handleError, setErrorMessage} from '../../../../core/utils/common.utils';
import $ from 'jquery';

import {ItemService} from '../../../../core/service/platform/item.service';
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
      name: new ExtendedFormControl('', [], 'name'),
      description: new ExtendedFormControl('', [], 'description'),
      item_type: new ExtendedFormControl('', [], 'item_type'),
      category: new ExtendedFormControl('', [], 'category'),
      status: new ExtendedFormControl('', [], 'status'),
      meta_data: this.fb.array([]),
      filterable_fields: this.fb.array([]),
      icon: new ExtendedFormControl('', [], 'icon'),
      cover_photos: new ExtendedFormControl('', [], 'cover_photos'),
      variant_property: new ExtendedFormControl('', [], 'variant_property'),
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
              this.itemDetailsForm.get('variant_property').setValue(this.meta.get(itemData['item_type']).get('variant').get(itemData['variants'][0]['reference_id']));
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
            this.itemDetailsForm.get(field)?.setValue(this.meta.get(itemData['item_type']).get('category').get(itemData[field]));
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
    this.itemDetails = itemData
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
          }, [], 'variant_name'),
          variant_price: new ExtendedFormControl({
            value: data['price']?.toFixed(2),
            disabled: disabled
          }, [], 'variant_price'),
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
          }, [], 'filter_name'),
          filter_value: new ExtendedFormControl({
            value: data['value'],
            disabled: false
          }, [], 'filter_value'),
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
}
