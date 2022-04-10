import {Component, ElementRef, ViewChild} from '@angular/core'
import {DatePipe} from '@angular/common'
import {ActivatedRoute, Router} from '@angular/router'
import {FormBuilder, FormGroup} from '@angular/forms'
import {ShopService} from '../../../../core/service/admin/shop.service'
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils'
import {handleError} from '../../../../core/utils/common.utils'
import {NgbDate} from '@ng-bootstrap/ng-bootstrap'
import {APP_ROUTES} from '../../../../core/utils/constants.utils'
import {BaseComponent} from '../../../../base.component'
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent extends BaseComponent {
  readonly headerHeight = 50;
  readonly rowHeight = 50;
  readonly pageLimit = 10;
  breadCrumbData = [{label: 'Home', link: APP_ROUTES.DASHBOARD}, {label: 'Shops', link: ''}];
  rows = []
  isLoading = true
  statuses = ['DRAFT', 'PENDING', 'ACTIVE', 'BLOCKED', 'REJECTED', 'INACTIVE']
  shopSearchForm: FormGroup
  hoveredDate: NgbDate | null = null
  @ViewChild('shopList') table
  @ViewChild('datePicker') datePicker
  endReached = false
  nextPageToken = null
  totalElements = 0

  constructor(private fb: FormBuilder, public datepipe: DatePipe, private shopService: ShopService, private router: Router,
              private route: ActivatedRoute, private el: ElementRef, private toastr: ToastrService) {
    super()
    this.shopSearchForm = this.fb.group({
      id: new ExtendedFormControl('', [], 'id'),
      status: new ExtendedFormControl('', [], 'status'),
      sort_order: new ExtendedFormControl('', [], 'sort_order'),
      start_date: new ExtendedFormControl(null, [], 'start_date'),
      end_date: new ExtendedFormControl(null, [], 'end_date'),
      className: 'shop-search'
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      Object.entries(params).forEach(
        ([key, value]) => {
          switch (key) {
            case 'status':
              var status_value = []
              switch (typeof value) {
                case 'string':
                  status_value = this.statuses.includes(params[key]) ? [params[key]] : null
                  break
                default:
                  status_value = []
                  value.forEach(val => {
                    if (this.statuses.includes(val)) status_value.push(val)
                  })
              }
              if (status_value != null && status_value != []) this.shopSearchForm.get('status')?.setValue(status_value)
              break
            case 'start_date':
            case 'end_date':
              var [year, month, day] = params[key].split('-');
              this.shopSearchForm.get(key).setValue(new NgbDate(parseInt(year), parseInt(month), parseInt(day)))
              this.datePicker.onDateSelection(this.shopSearchForm.get(key).value)
              break
            case 'sort_order':
            case 'id':
              this.shopSearchForm.get(key)?.setValue(value)
          }
        }
      )
    })
    this.updateUrl()
    this.getShopList()
    this.onScroll(0);
  }

  updateUrl() {
    let query = {}
    for (const field in this.shopSearchForm.controls) {
      if (field != 'className' && this.shopSearchForm.get(field).value != '' && this.shopSearchForm.get(field).value != null)
        switch (field) {
          case 'start_date':
          case 'end_date':
            var date_field = this.shopSearchForm.get(field).value
            query[field] = `${this.datepipe.transform(new Date(date_field.year, date_field.month - 1, date_field.day), 'yyyy-MM-dd')}`
            break
          default:
            query[field] = this.shopSearchForm.get(field).value
        }
      else
        query[field] = null
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: query,
      queryParamsHandling: 'merge',
    })
  }

  updateFilters() {
    this.rows = []
    this.endReached = false
    this.nextPageToken = null
    this.getShopList()
  }

  getShopList() {
    this.isLoading = true
    let paramString = '';
    if (this.nextPageToken != null)
      paramString = paramString + `&next_page_token=${this.nextPageToken}`
    else {
      for (const field in this.shopSearchForm.controls) {
        if (this.shopSearchForm.get(field).value != null && this.shopSearchForm.get(field).value != '')
          switch (field) {
            case 'status':
              for (let i = 0; i < this.shopSearchForm.get('status').value.length; i++) {
                paramString = paramString + `&statuses[]=${this.shopSearchForm.get('status').value[i]}`
              }
              break
            case 'start_date':
            case 'end_date':
              var date_field = this.shopSearchForm.get(field).value
              paramString = paramString + `&${field}=${this.datepipe.transform(new Date(date_field.year, date_field.month - 1,
                date_field.day), 'yyyy-MM-dd')}`;
              break
            case 'id':
            case 'sort_order':
              paramString = paramString + `&${field}=${this.shopSearchForm.get(field).value}`
              break
          }
      }
      this.updateUrl()
    }

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
    if (event.type == 'click') {
      if (event.cellIndex == 5)
        this.router.navigateByUrl(`${APP_ROUTES.SHOP}/${event.row.id}${APP_ROUTES.ITEM}`)
      else
        this.router.navigateByUrl(`${APP_ROUTES.SHOP}/${event.row.id}`)
    }
  }

  onDateSelection(selectedDate: Map<string, NgbDate>) {
    this.shopSearchForm.get('start_date').setValue(selectedDate.get('fromDate'))
    this.shopSearchForm.get('end_date').setValue(selectedDate.get('toDate'))
  }

  reset() {
    this.shopSearchForm.get('start_date').setValue(null)
    this.shopSearchForm.get('end_date').setValue(null)
    this.shopSearchForm.reset({className: 'shop-search'});
    this.updateFilters()
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
