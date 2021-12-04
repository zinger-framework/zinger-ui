import {Component, ViewChild, ElementRef} from '@angular/core'
import {DatePipe} from '@angular/common'
import {Router, ActivatedRoute} from '@angular/router'
import {FormBuilder, FormGroup} from '@angular/forms'
import {ShopService} from '../../../../core/service/admin/shop.service'
import {SortType, ColumnMode} from '@swimlane/ngx-datatable'
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils'
import {handleError} from '../../../../core/utils/common.utils'
import {Page} from '../../../../core/utils/paging.utils'
import {NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap'
import {APP_ROUTES} from '../../../../core/utils/constants.utils'
import {BaseComponent} from '../../../../base.component'
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent extends BaseComponent {
  readonly headerHeight = 50;
  readonly rowHeight = 50;
  readonly pageLimit = 2;
  rows = []
  isLoading = false
  statuses = ['PENDING', 'ACTIVE', 'INACTIVE', 'BLOCKED']
  ColumnMode = ColumnMode
  shopSearchForm: FormGroup
  hoveredDate: NgbDate | null = null
  startDate: NgbDate | null
  endDate: NgbDate | null
  currentFilters = {}
  @ViewChild('shopList') table
  @ViewChild('datePicker') datePicker
  endReached = false
  nextPageToken = null
  totalElements = 0

  constructor(private fb: FormBuilder, private calendar: NgbCalendar, public datepipe: DatePipe, private shopService: ShopService, 
    private router: Router, private route: ActivatedRoute, private el: ElementRef, private toastr: ToastrService) {
  
    super()
    this.shopSearchForm = this.fb.group({
      id: new ExtendedFormControl('', [], 'id'),
      status: new ExtendedFormControl('', [], 'status'),
      sortOrder: new ExtendedFormControl('', [], 'sortOrder'),
      deleted: new ExtendedFormControl(null, [], 'deleted'),
      className: 'shop-search'
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // console.log('start end')
    // this.datePicker.onDateSelection(this.startDate)
    // this.datePicker.onDateSelection(this.endDate)
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
          else if(key == 'startDate') {
            const [year, month, day] = params[key].split('-');
            this.startDate = new NgbDate(parseInt(year), parseInt(month), parseInt(day));
            this.datePicker.onDateSelection(this.startDate)
          }
          else if(key == 'endDate') {
            const [year, month, day] = params[key].split('-');
            this.endDate = new NgbDate(parseInt(year), parseInt(month), parseInt(day));
            this.datePicker.onDateSelection(this.endDate)
          }
          this.currentFilters[key] = value
          this.shopSearchForm.get(key)?.setValue(value)
        }
      }
    })
    this.updateUrl()
    this.getShopList()
    this.onScroll(0);
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
    this.resetFilters()
    this.nextPageToken = null
    this.currentFilters['id'] = this.shopSearchForm.get('id').value
    if (this.shopSearchForm.get('status').value != '') 
      this.currentFilters['status'] = this.shopSearchForm.get('status').value
    if(this.shopSearchForm.get('deleted').value != '')
      this.currentFilters['deleted'] = this.shopSearchForm.get('deleted').value
    if (this.shopSearchForm.get('sortOrder').value != '') 
      this.currentFilters['sortOrder'] = this.shopSearchForm.get('sortOrder').value;
    if(this.startDate != null)
      this.currentFilters['startDate'] = this.datepipe.transform(new Date(this.startDate.year, this.startDate.month - 1, 
        this.startDate.day), 'yyyy-MM-dd')
    if(this.endDate != null)
      this.currentFilters['endDate'] = this.datepipe.transform(new Date(this.endDate.year, this.endDate.month - 1, 
        this.endDate.day), 'yyyy-MM-dd')
    this.rows = []
    this.endReached = false
    this.getShopList()
  }

  getShopList() {
    this.isLoading = true
    let paramString = '';
    for(let i = 0; i < this.currentFilters['status']?.length ; i++) {
      paramString = paramString + `&statuses[]=${this.currentFilters['status'][i]}`
    }
    if (this.currentFilters['startDate'] != '') paramString = paramString + `&start_date=${this.currentFilters['startDate']}`
    if (this.currentFilters['endDate'] != '') paramString = paramString + `&end_date=${this.currentFilters['endDate']}`
    if (this.currentFilters['sortOrder'] != '' && this.currentFilters['sortOrder'] != null) paramString = paramString + `&sort_order=${this.currentFilters['sortOrder']}`
    if (this.currentFilters['id'] != '' && this.currentFilters['id'] != null) paramString = paramString + `&id=${this.currentFilters['id']}`
    this.updateUrl()
    if (this.nextPageToken != null) paramString = paramString + `&next_page_token=${this.nextPageToken}`

    this.shopService.getShopList(paramString + `&page_size=10`)
    .then(response => {
      this.rows = this.rows.concat(response['data']['shops'])
      if ('next_page_token' in response['data'])
        this.nextPageToken = response['data']['next_page_token']
      else 
        this.endReached = true
      if ('total' in response['data']) this.totalElements = response['data']['total']
    })
    .catch(error => {
      handleError(error, this.shopSearchForm)
    })
    .finally(() => {
      this.isLoading = false
    })
  }

  onRowClick(event) {
    if(event.type == 'click') {
        this.router.navigateByUrl(APP_ROUTES.SHOP + '/' + event.row.id)
    }
  }

  onDateSelection(selectedDate: Map<string, NgbDate>) {
    this.startDate = selectedDate.get('fromDate')
    this.endDate = selectedDate.get('toDate')
  }

  reset() {
    this.startDate = null
    this.endDate = null
    this.shopSearchForm.reset({deleted: null, className: 'shop-search'});
    this.updateFilters()
  }

  resetFilters() {
    this.currentFilters['id'] = ''
    this.currentFilters['status'] = ''
    this.currentFilters['sortOrder'] = ''
    this.currentFilters['startDate'] = ''
    this.currentFilters['endDate'] = ''
    // this.currentFilters['endDate'] = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')
  }

  onScroll(offsetY: number) {
    console.log("on scroll called " + this.el.nativeElement.getBoundingClientRect().height)
    // total height of all rows in the viewport
    const viewHeight = this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;

    // check if we scrolled to the end of the viewport
    if (!this.isLoading && offsetY + viewHeight >= this.rows.length * this.rowHeight && this.endReached == false ) {
      console.log("scroll request made")
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
      this.getShopList()
    }
  }

  addShop() {
    this.shopService.addNewShop()
      .then(response => {
        this.router.navigate([APP_ROUTES.SHOP + '/' + response['data']['shop']['id']], {state: response['data']})
      })
      .catch(error => {
        this.toastr.error(error['error']['message']);
      })
  }

}
