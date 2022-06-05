import {Component, ElementRef, ViewChild} from '@angular/core';
import {APP_ROUTES} from "../../../../core/utils/constants.utils";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {BaseComponent} from "../../../../base.component";
import {DatePipe} from "@angular/common";
import {OrderService} from "../../../../core/service/platform/order.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ExtendedFormControl} from "../../../../core/utils/extended-form-control.utils";
import {handleError} from "../../../../core/utils/common.utils";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent extends BaseComponent {
  breadCrumbData = [{label: 'Home', link: APP_ROUTES.DASHBOARD}, {label: 'Shops', link: APP_ROUTES.SHOP}]
  readonly headerHeight = 50;
  readonly rowHeight = 50;
  readonly pageLimit = 20;
  rows = []
  isLoading = true
  statuses = {
    order_status: ['created', 'placed', 'delivery_pending', 'delivered', 'cancelled'],
    payment_status: ['pending', 'completed', 'failed', 'refund_pending', 'refund_failed', 'refund_completed']
  }
  orderSearchForm: FormGroup
  hoveredDate: NgbDate | null = null
  @ViewChild('orderList') table
  @ViewChild('datePicker') datePicker
  endReached = false
  nextPageToken = null
  totalElements = 0
  shopId: number

  constructor(private fb: FormBuilder, public datepipe: DatePipe, private orderService: OrderService,
              private router: Router, private route: ActivatedRoute, private el: ElementRef) { 
    super()
    this.route.params.subscribe(params => {
      this.shopId = params['shop_id']
      this.breadCrumbData.push(
        {label: String(this.shopId), link: `${APP_ROUTES.SHOP}/${this.shopId}`},
        {label: 'Orders', link: ''}
      )
    });
    this.orderSearchForm = this.fb.group({
      id: new ExtendedFormControl('', [], 'id'),
      order_status: new ExtendedFormControl('', [], 'order_status'),
      payment_status: new ExtendedFormControl('', [], 'payment_status'),
      sort_order: new ExtendedFormControl('ASC', [], 'sort_order'),
      start_date: new ExtendedFormControl(null, [], 'start_date'),
      end_date: new ExtendedFormControl(null, [], 'end_date'),
      className: 'order-search'
    })    
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      Object.entries(params).forEach(
        ([key, value]) => {
          switch (key) {
            case 'order_status':
            case 'payment_status':
              var status_value = []
              switch (typeof value) {
                case 'string':
                  status_value = this.statuses[key].includes(params[key]) ? [params[key]] : null
                  break
                default:
                  status_value = []
                  value.forEach(val => {
                    if (this.statuses[key].includes(val)) status_value.push(val)
                  })
              }
              if (status_value != null && status_value != []) this.orderSearchForm.get(key)?.setValue(status_value)
              break
            case 'start_date':
            case 'end_date':
              var [year, month, day] = params[key].split('-');
              this.orderSearchForm.get(key).setValue(new NgbDate(parseInt(year), parseInt(month), parseInt(day)))
              this.datePicker.onDateSelection(this.orderSearchForm.get(key).value)
              break
            case 'sort_order':
            case 'id':
              this.orderSearchForm.get(key)?.setValue(value)
          }
        }
      )
    })
    this.updateUrl()
    this.getOrderList()
    this.onScroll(0);
  }

  updateUrl() {
    let query = {}
    for (const field in this.orderSearchForm.controls) {
      if (field != 'className' && this.orderSearchForm.get(field).value != '' && this.orderSearchForm.get(field).value != null)
        switch (field) {
          case 'start_date':
          case 'end_date':
            var date_field = this.orderSearchForm.get(field).value
            query[field] = `${this.datepipe.transform(new Date(date_field.year, date_field.month - 1, date_field.day), 'yyyy-MM-dd')}`
            break
          default:
            query[field] = this.orderSearchForm.get(field).value
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
    this.getOrderList()
  }

  getOrderList() {
    this.isLoading = true
    let paramString = '';
    if (this.nextPageToken != null)
      paramString = paramString + `&next_page_token=${this.nextPageToken}`
    else {
      for (const field in this.orderSearchForm.controls) {
        if (this.orderSearchForm.get(field).value != null && this.orderSearchForm.get(field).value != '')
          switch (field) {
            case 'order_status':
            case 'payment_status':
              for (let i = 0; i < this.orderSearchForm.get(field).value.length; i++) {
                paramString = paramString + `&${field}[]=${this.orderSearchForm.get(field).value[i]}`
              }
              break
            case 'start_date':
            case 'end_date':
              var date_field = this.orderSearchForm.get(field).value
              paramString = paramString + `&${field}=${this.datepipe.transform(new Date(date_field.year, date_field.month - 1,
                date_field.day), 'yyyy-MM-dd')}`;
              break
            case 'id':
            case 'sort_order':
              paramString = paramString + `&${field}=${this.orderSearchForm.get(field).value}`
              break
          }
      }
      this.updateUrl()
    }

    this.orderService.getOrderList(this.shopId, `${paramString}&page_size=${this.pageLimit}`)
      .then(response => {
        this.rows = this.rows.concat(response['data']['orders'])
        if ('next_page_token' in response['data'])
          this.nextPageToken = response['data']['next_page_token']
        else
          this.endReached = true
        if ('total' in response['data']) this.totalElements = response['data']['total']
      })
      .catch(error => {
        handleError(error, this.orderSearchForm)
      })
      .finally(() => {
        this.isLoading = false
      })
  }

  onRowClick(event) {
    if (event.type == 'click') {
      this.router.navigateByUrl(`${APP_ROUTES.SHOP}/${this.shopId}${APP_ROUTES.ORDER}/${event.row.id}`)
    }
  }

  onDateSelection(selectedDate: Map<string, NgbDate>) {
    this.orderSearchForm.get('start_date').setValue(selectedDate.get('fromDate'))
    this.orderSearchForm.get('end_date').setValue(selectedDate.get('toDate'))
  }

  reset() {
    this.orderSearchForm.get('start_date').setValue(null)
    this.orderSearchForm.get('end_date').setValue(null)
    this.orderSearchForm.reset({className: 'order-search'});
    this.orderSearchForm.get('sort_order').setValue('ASC')
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
      this.getOrderList()
    }
  }
}
