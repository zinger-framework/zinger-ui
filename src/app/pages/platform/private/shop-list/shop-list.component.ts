import {Component, ViewChild} from '@angular/core'
import {DatePipe} from '@angular/common'
import {Router, ActivatedRoute} from '@angular/router'
import {FormBuilder, FormGroup} from '@angular/forms'
import {ShopService} from '../../../../core/service/platform/shop.service'
import {SortType, ColumnMode} from '@swimlane/ngx-datatable'
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils'
import {handleError} from '../../../../core/utils/common.utils'
import {Page} from '../../../../core/utils/paging.utils'
import {NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap'
import {APP_ROUTES} from '../../../../core/utils/constants.utils'
import {BaseComponent} from '../../../../base.component'

@Component({
  selector: 'shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent extends BaseComponent {
  rows = []
  page = new Page()
  isLoading = false
  statuses = ['PENDING', 'ACTIVE', 'INACTIVE', 'BLOCKED']
  deletedStatus = ['ALL', 'TRUE', 'FALSE']
  ColumnMode = ColumnMode
  shopSearchForm: FormGroup
  hoveredDate: NgbDate | null = null
  fromDate: NgbDate | null
  toDate: NgbDate | null
  pageSize = 25
  currentFilters = {}
  cache = new Map()
  @ViewChild('shopList') table

  constructor(private fb: FormBuilder, private calendar: NgbCalendar, public datepipe: DatePipe, private shopService: ShopService, 
    private router: Router, private route: ActivatedRoute) {
  
    super()
    // this.toDate = calendar.getPrev(calendar.getToday(), 'd', 10)
    this.page.pageNumber = 0
    this.page.size = this.pageSize
    this.shopSearchForm = this.fb.group({
      searchText: new ExtendedFormControl('', [], 'searchText'),
      status: new ExtendedFormControl('', [], 'status'),
      sortOrder: new ExtendedFormControl('', [], 'sortOrder'),
      deleted: new ExtendedFormControl(null, [], 'deleted'),
      className: 'shop-search'
    })
  }

  ngOnInit(): void {
    this.resetFilters()
    this.route.queryParams.subscribe(params => {
      for (let key of Object.keys(this.currentFilters)) {
        if(key in params && params[key] != '') {
          let value = params[key]
          if(key == 'status') {
            switch(typeof params[key]) {
              case 'string': 
                value = this.statuses.includes(params[key]) ? [params[key]] : null
                break
              default:
                value = []
                params[key].forEach(val => {
                  if(this.statuses.includes(val)) value.push(val)
                })
            }
            if(value == null || value == []) continue
          }
          this.updateUrl()
          this.currentFilters[key] = value
          this.shopSearchForm.get(key)?.setValue(value)
        }
      }
    })
    this.setPage({ offset: 0 })
  }

  updateUrl() {
    let query = {}
    for (let key of Object.keys(this.currentFilters)) {
      if(this.currentFilters[key] != ''){
        query[key] = this.currentFilters[key]
      }
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: query,
      queryParamsHandling: 'merge',
    })
  }

  updateFilters() {
    this.page.pageNumber = 0
    this.resetFilters()
    this.cache = new Map()
    this.currentFilters['searchText'] = this.shopSearchForm.get('searchText').value
    if (this.shopSearchForm.get('status').value != '') 
      this.currentFilters['status'] = this.shopSearchForm.get('status').value
    switch (this.shopSearchForm.get('deleted').value) {
      case 'TRUE': this.currentFilters['deleted'] = 'true'; break;
      case 'FALSE': this.currentFilters['deleted'] = 'false'; break;
      default: this.currentFilters['deleted'] = ''
    }
    if (this.shopSearchForm.get('sortOrder').value != '') 
      this.currentFilters['sortOrder'] = this.shopSearchForm.get('sortOrder').value;
    if(this.fromDate != null)
      this.currentFilters['fromDate'] = this.datepipe.transform(new Date(this.fromDate.year, this.fromDate.month - 1, 
        this.fromDate.day), 'yyyy-MM-dd HH:mm:ss')
    if(this.toDate != null)
      this.currentFilters['toDate'] = this.datepipe.transform(new Date(this.toDate.year, this.toDate.month - 1, 
        this.toDate.day), 'yyyy-MM-dd HH:mm:ss')
    this.getShopList()
  }

  getShopList() {
    let offset = this.page.pageNumber * this.pageSize
    if(this.cache.get(offset) != null) {
      this.rows = this.cache.get(offset)
      return
    }

    this.isLoading = true
    let paramString = 'offset=' + offset;
    for(let i = 0; i < this.currentFilters['status']?.length ; i++) {
      paramString = paramString + `&statuses[]=${this.currentFilters['status'][i]}`
    }

    if (this.currentFilters['deleted'] != '' && this.currentFilters['deleted'] != null ) paramString = paramString + `&deleted=${this.currentFilters['deleted']}`
    // if (this.currentFilters['fromDate'] != '') paramString = paramString + `&start_time=${this.currentFilters['fromDate']}`
    // if (this.currentFilters['toDate'] != '') paramString = paramString + `&end_time=${this.currentFilters['toDate']}`
    if (this.currentFilters['sortOrder'] != '' && this.currentFilters['sortOrder'] != null) paramString = paramString + `&sort_order=${this.currentFilters['sortOrder']}`
    if (this.currentFilters['searchText'] != '' && this.currentFilters['searchText'] != null) paramString = paramString + `&name=${this.currentFilters['searchText']}`
    this.updateUrl()

    this.shopService.getShopList(paramString)
    .then(response => {
      this.rows = response['data']['shops']
      this.page.totalElements = response['data']['total']
      this.page.totalPages = response['data']['total'] / this.pageSize
      this.updateCache(offset, response)
    })
    .catch(error => {
      handleError(error, this.shopSearchForm)
    })
    .finally(() => {
      this.isLoading = false
    })
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset
    this.getShopList()
  }

  onRowClick(event) {
    if(event.type == 'click') {
        this.router.navigateByUrl(APP_ROUTES.SHOP + '/' + event.row.id)
    }
  }

  onDateSelection(selectedDate: Map<string, NgbDate>) {
    this.fromDate = selectedDate.get('fromDate')
    this.toDate = selectedDate.get('toDate')
  }

  updateCache(offset: number, response: Object) {
    this.cache.set(offset, response['data']['shops'])
    this.cache.set('total', response['data']['total'])
  }

  reset() {
    this.toDate = null
    this.fromDate = null
    this.shopSearchForm.reset({deleted: null, className: 'shop-search'});
    this.updateFilters()
  }

  resetFilters() {
    this.currentFilters['searchText'] = ''
    this.currentFilters['deleted'] = ''
    this.currentFilters['status'] = ''
    this.currentFilters['sortOrder'] = ''
    this.currentFilters['fromDate'] = ''
    this.currentFilters['toDate'] = ''
    // this.currentFilters['toDate'] = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')
  }
}
