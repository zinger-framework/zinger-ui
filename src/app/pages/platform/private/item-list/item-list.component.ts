import {Component, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {FormBuilder, FormGroup} from '@angular/forms'

import {ColumnMode} from '@swimlane/ngx-datatable'

import {ItemService} from '../../../../core/service/platform/item.service'
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils'
import {BaseComponent} from '../../../../base.component'
import {APP_ROUTES} from '../../../../core/utils/constants.utils'
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
  isLoading = true
  details = {
    types: ['Food', 'Fashion'],
    categories: {
      'Food': ['North India', 'chinese', 'south india', 'beverages', 'dessert', 'Biriyani', 'FastFood', 'kebab'],
      'Fashion': ['shirts', 'jackets', 'jeans', 'ethnic_wear', 'accessories', 'footwear', 'innerwear']
    },
    variantProperty: {'Food': ['quantity', 'size'], 'Fashion': ['size', 'color']}

  }
  types = ['Food', 'Fashion']
  ColumnMode = ColumnMode
  itemSearchForm: FormGroup
  endReached = false
  nextPageToken = null
  totalElements = 0
  shopId: number

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private el: ElementRef,
              private itemService: ItemService) {
    super()
    this.route.params.subscribe(params => this.shopId = params['shop_id']);
    this.itemSearchForm = this.fb.group({
      id: new ExtendedFormControl('', [], 'id'),
      category: new ExtendedFormControl(null, [], 'category'),
      include_inactive: new ExtendedFormControl(null, [], 'include_inactive'),
      className: 'item-search'
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      Object.entries(params).forEach(
        ([key, value]) => {
          switch (key) {
            case 'category':
              var categoryValues = []
              switch (typeof value) {
                case 'string':
                  categoryValues = this.details['categories']['Food'].includes(params[key]) ? [params[key]] : null
                  break
                default:
                  categoryValues = []
                  value.forEach(val => {
                    if (this.details['categories']['Food'].includes(val)) categoryValues.push(val)
                  })
              }
              if (categoryValues != null && categoryValues != []) this.itemSearchForm.get('category')?.setValue(categoryValues)
              break
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
                paramString = paramString + `&category[]=${this.itemSearchForm.get('category').value[i]}`
              }
              break
            case 'id':
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
}
