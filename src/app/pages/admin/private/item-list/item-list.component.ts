import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'

import {ColumnMode} from '@swimlane/ngx-datatable'
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
  readonly headerHeight = 50;
  readonly rowHeight = 50;
  readonly pageLimit = 10;
  rows = []
  categories = {}
  isLoading = true
  meta = {}
  types = ['Food', 'Fashion']
  ColumnMode = ColumnMode
  itemSearchForm: FormGroup
  createItemForm: FormGroup
  endReached = false
  nextPageToken = null
  totalElements = 0
  shopId: number
  @ViewChild('createItemModal', {read: TemplateRef}) createItemModal: TemplateRef<any>;
  itemTypes = []

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private el: ElementRef,
              private itemService: ItemService, private modalService: NgbModal) {
    super()
    this.route.params.subscribe(params => this.shopId = params['shop_id']);
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

  ngOnInit(): void {
    this.getMeta()
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
      paramString = paramString + `&next_page_token=${this.nextPageToken}`
    else {
      for (const field in this.itemSearchForm.controls) {
        if (this.itemSearchForm.get(field).value != null && this.itemSearchForm.get(field).value != '')
          switch (field) {
            case 'category':
              for (let i = 0; i < this.itemSearchForm.get('category').value.length; i++) {
                paramString = paramString + `&categories[]=${this.itemSearchForm.get('category').value[i]}`
              }
              break
            case 'id':
            case 'item_type':
            case 'include_inactive':
              paramString = paramString + `&${field}=${this.itemSearchForm.get(field).value}`
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

  addItem() {
    let requestObj = {}
    Object.keys(this.createItemForm.value)
      .map(k => requestObj[k] = this.createItemForm.get(k).value)
    this.itemService.addNewItem(this.shopId, requestObj)
      .then(response => {
        this.rows = []
        this.updateFilters()
        this.modalService.dismissAll();
      })
      .catch(error => {
        let reason = error['error']['reason']
        handleError(error, this.createItemForm);
      });
  }

  showCreateItemModal() {
    this.modalService.open(this.createItemModal, {centered: true});
    this.createItemForm.reset({className: 'item-create'});
  }

  updateFilters() {
    this.rows = []
    this.endReached = false
    this.nextPageToken = null
    this.getItemList()
  }

  reset() {
    this.itemSearchForm.reset({className: 'item-search'});
    this.updateFilters()
  }

  loadPage() {
    this.route.queryParams.subscribe(params => {
      if(Object.keys(params).includes('item_type') && this.itemTypes.includes(params['item_type'])) 
        this.itemSearchForm.get('item_type')?.setValue(params['item_type'])

      if (Object.keys(params).includes('item_type') && Object.keys(params).includes('category') 
        && this.itemTypes.includes(params['item_type'])) {
        var categoryValues = []
        var itemType = params['item_type']
        switch (typeof params['category']) {
          case 'string':
            categoryValues = this.categories[itemType].includes(params['category']) ? [params['category']] : []
            break
          default:
            categoryValues = []
            params['category'].forEach(val => {
              if(this.categories[itemType].includes(val))
                categoryValues.push(val)
            })
        }
        if (categoryValues != []) this.itemSearchForm.get('category').setValue(categoryValues)
      }
      
      Object.entries(params).forEach(
        ([key, value]) => {
          switch (key) {
            case 'item_type':
            case 'category': 
              break;
            default:
              this.itemSearchForm.get(key)?.setValue(value)
          }
        }
      )
    })

    this.updateUrl()
    this.getItemList()
    this.onScroll(0);
  }

  resetCategoryFilter() {
    this.itemSearchForm.get('category').setValue(null)
  }

  getMeta() {
    this.itemService.getMeta()
      .then(response => {
        this.meta = response['data']
        this.itemTypes = Object.keys(this.meta)
        for (let itemType of this.itemTypes) {
          this.categories[itemType] = []
          this.meta[itemType]['category'].map(category => this.categories[itemType].push(category.reference_id));
        }
        this.loadPage()
      })
      .catch(error => {
        let reason = error['error']['reason']
        handleError(error, this.itemSearchForm);
      });
  }
}
