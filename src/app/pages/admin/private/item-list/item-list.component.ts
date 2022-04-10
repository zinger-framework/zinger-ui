import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {APP_ROUTES, ITEM_DESC_REGEX, ITEM_ID_REGEX, ITEM_NAME_REGEX} from "../../../../core/utils/constants.utils";
import {ItemService} from '../../../../core/service/admin/item.service'
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils'
import {BaseComponent} from '../../../../base.component'
import {handleError} from '../../../../core/utils/common.utils'

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent extends BaseComponent {
  breadCrumbData = [{label: 'Home', link: APP_ROUTES.DASHBOARD}, {label: 'Shops', link: APP_ROUTES.SHOP}]
  readonly headerHeight = 50;
  readonly rowHeight = 50;
  readonly pageLimit = 10;
  rows = []
  isLoading = true
  meta = new Map
  itemSearchForm: FormGroup
  createItemForm: FormGroup
  endReached = false
  nextPageToken = null
  totalElements = 0
  shopId: number
  @ViewChild('createItemModal', {read: TemplateRef}) createItemModal: TemplateRef<any>;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private el: ElementRef,
              private itemService: ItemService, private modalService: NgbModal) {
    super()
    this.route.params.subscribe(params => {
      this.shopId = params['shop_id']
      this.breadCrumbData.push(
        {label: String(this.shopId), link: `${APP_ROUTES.SHOP}/${this.shopId}`},
        {label: 'Items', link: ''}
      )
    });
    this.itemSearchForm = this.fb.group({
      id: new ExtendedFormControl('', [Validators.pattern(ITEM_ID_REGEX)], 'id'),
      item_type: new ExtendedFormControl(null, [], 'item_type'),
      category: new ExtendedFormControl(null, [], 'category'),
      include_inactive: new ExtendedFormControl(null, [], 'include_inactive'),
      className: 'item-search'
    })

    this.createItemForm = this.fb.group({
      name: new ExtendedFormControl('', [Validators.required, Validators.pattern(ITEM_NAME_REGEX)], 'name'),
      description: new ExtendedFormControl('', [Validators.pattern(ITEM_DESC_REGEX)], 'description'),
      category: new ExtendedFormControl(null, [Validators.required], 'category'),
      item_type: new ExtendedFormControl(null, [Validators.required], 'item_type'),
      className: 'item-create'
    })
  }

  ngOnInit() {
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
        this.loadItemSearchForm()
      })
      .catch(error => {
        handleError(error, this.itemSearchForm);
      });
  }

  loadItemSearchForm() {
    this.route.queryParams.subscribe(params => {
      if (this.meta.has(params['item_type'])) {
        this.itemSearchForm.get('item_type').setValue(params['item_type'])
        switch (typeof params['category']) {
          case 'string':
            if (this.meta.get(params['item_type']).has(params['category']))
              this.itemSearchForm.get('category').setValue([params['category']])
            break
          default:
            let categories = params['category'].filter(category => !this.meta.get(params['item_type']).has(category))
            if (categories.size > 0) this.itemSearchForm.get('category').setValue(categories)
        }
      }

      Object.entries(params).forEach(([key, value]) => {
        switch (key) {
          case 'item_type':
          case 'category':
            break;
          default:
            this.itemSearchForm.get(key)?.setValue(value)
        }
      })
    })

    this.updateUrl()
    this.getItemList()
    this.onScroll(0);
  }

  updateUrl() {
    let query = {}
    for (const field in this.itemSearchForm.controls) {
      if (field != 'className' && this.itemSearchForm.get(field).value != '' && this.itemSearchForm.get(field).value != null)
        query[field] = this.itemSearchForm.get(field).value
      else
        query[field] = null
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: query,
      queryParamsHandling: 'merge',
    })
  }

  getItemList() {
    this.isLoading = true
    let paramString = 'page_size=10';
    if (this.nextPageToken != null)
      paramString = `${paramString}&next_page_token=${this.nextPageToken}`
    else {
      for (const field in this.itemSearchForm.controls) {
        if (this.itemSearchForm.get(field).value != null && this.itemSearchForm.get(field).value != '')
          switch (field) {
            case 'category':
              for (let category of this.itemSearchForm.get('category').value)
                paramString = `${paramString}&categories[]=${category}`
              break
            case 'id':
            case 'item_type':
            case 'include_inactive':
              paramString = `${paramString}&${field}=${this.itemSearchForm.get(field).value}`
          }
      }
      this.updateUrl()
    }

    this.itemService.getItemList(this.shopId, paramString)
      .then(response => {
        this.rows = this.rows.concat(response['data']['items'])
        if ('next_page_token' in response['data'])
          this.nextPageToken = response['data']['next_page_token']
        else
          this.endReached = true
        if ('total' in response['data']) this.totalElements = response['data']['total']
      })
      .catch(error => {
        handleError(error, this.itemSearchForm)
      })
      .finally(() => {
        this.isLoading = false
      })
  }

  updateFilters() {
    this.rows = []
    this.endReached = false
    this.nextPageToken = null
    this.getItemList()
  }

  resetCategoryFilter() {
    this.itemSearchForm.get('category').setValue(null)
  }

  reset() {
    this.itemSearchForm.reset({className: 'item-search'});
    this.updateFilters()
  }

  addItem() {
    let requestObj = {}
    Object.keys(this.createItemForm.value)
      .map(k => requestObj[k] = this.createItemForm.get(k).value)
    this.itemService.addNewItem(this.shopId, requestObj)
      .then(response => {
        this.modalService.dismissAll();
        this.router.navigateByUrl(`${APP_ROUTES.SHOP}/${String(this.shopId)}${APP_ROUTES.ITEM}/${(response as any).data.item.id}`)
      })
      .catch(error => {
        handleError(error, this.createItemForm);
      });
  }

  showCreateItemModal() {
    this.modalService.open(this.createItemModal, {centered: true});
    this.createItemForm.reset({className: 'item-create'});
  }

  onRowClick(event) {
    if (event.type == 'click') {
      this.router.navigateByUrl(`${APP_ROUTES.SHOP}/${String(this.shopId)}${APP_ROUTES.ITEM}/${event.row.id}`)
    }
  }

  onScroll(offsetY: number) {
    // total height of all rows in the viewport
    const viewHeight = this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;

    // check if we scrolled to the end of the viewport
    if (!this.isLoading && offsetY + viewHeight >= this.rows.length * this.rowHeight && this.endReached == false) {
      // total number of results to load
      let limit = this.pageLimit;

      // check if we haven't fetched any results yet
      if (this.rows.length === 0) {
        // calculate the number of rows that fit within viewport
        const pageSize = Math.ceil(viewHeight / this.rowHeight);

        // change the limit to pageSize such that we fill the first page entirely
        // (otherwise, we won't be able to scroll past it)
        limit = Math.max(pageSize, this.pageLimit);
      }
      this.getItemList()
    }
  }

}
