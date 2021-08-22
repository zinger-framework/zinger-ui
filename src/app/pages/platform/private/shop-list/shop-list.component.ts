import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShopService} from "../../../../core/service/platform/shop.service";
import {SortType, ColumnMode} from "@swimlane/ngx-datatable";
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';
import {ToastrService} from 'ngx-toastr';
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {APP_ROUTES} from '../../../../core/utils/constants.utils';

export class Page {
  size: number;
  totalElements: number;
  totalPages: number;
  pageNumber: number = 0;
}

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent implements OnInit {

  rows = [];
  page = new Page();
  isLoading = false;
  statuses = ['PENDING', 'ACTIVE', 'INACTIVE', 'BLOCKED']
  deletedStatus = ['ALL', 'TRUE', 'FALSE']
  columns = [
    {name: 'Id', prop: 'id', sortable: false, width: 10},
    {name: 'Name', prop: 'name', sortable: false, width:50},
    {name: 'Category', prop: 'category', sortable: false, width:50},
    {name: 'Tags', prop: 'tags', sortable: false, width:50},
    {name: 'Description', prop: 'description', sortable: false, width:50}
  ];
  SortType = SortType;
  ColumnMode = ColumnMode;
  shopSearchForm: FormGroup;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  rangeDate = '';
  pageSize = 2;
  currentFilters = {}
  cache = new Map();  
  @ViewChild('shopList') table;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, 
    public datepipe: DatePipe, private shopService: ShopService, private router: Router) {
    this.toDate = calendar.getPrev(calendar.getToday(), 'd', 10);
    this.page.pageNumber = 0;
    this.page.size = this.pageSize;

    this.shopSearchForm = this.fb.group({
      query: new ExtendedFormControl('', [], 'query'),
      status: new ExtendedFormControl('', [], 'status'),
      sortorder: new ExtendedFormControl('', [], 'sortorder'),
      deleted: new ExtendedFormControl(null, [], 'deleted'),
      className: 'shop-search'
    });
  }

  ngOnInit(): void {
    this.resetFilters();
    this.setPage({ offset: 0 });
  }

  updateFilters() {
    this.page.pageNumber = 0;
    this.resetFilters();
    this.cache = new Map();
    this.currentFilters['query'] = this.shopSearchForm.get('query').value;
    if (this.shopSearchForm.get('status').value != '') 
      this.currentFilters['status'] = this.shopSearchForm.get('status').value;
    switch (this.shopSearchForm.get('deleted').value) {
      case 'TRUE': this.currentFilters['deleted'] = 'true'; break;
      case 'FALSE': this.currentFilters['deleted'] = 'false'; break;
      default: this.currentFilters['deleted'] = ''
    }
    if (this.shopSearchForm.get('sortorder').value != '') 
      this.currentFilters['sortorder'] = this.shopSearchForm.get('sortorder').value;
    if(this.fromDate != null)
      this.currentFilters['fromDate'] = this.datepipe.transform(new Date(this.fromDate.year, this.fromDate.month - 1, 
        this.fromDate.day), 'yyyy-MM-dd HH:mm:ss');
    if(this.toDate != null)
      this.currentFilters['toDate'] = this.datepipe.transform(new Date(this.toDate.year, this.toDate.month - 1, 
        this.toDate.day), 'yyyy-MM-dd HH:mm:ss');
    console.log(this.currentFilters)
    this.getShopList();
  }

  getShopList() {
    let offset = this.page.pageNumber * this.pageSize
    if(this.cache.get(offset) != null) {
      this.rows = this.cache.get(offset)
      return
    }

    this.isLoading = true;
    let paramString = 'offset=' + offset;
    for(let i = 0; i < this.currentFilters['status'].length ; i++) {
      paramString = paramString + `&statuses[]=${this.currentFilters['status'][i]}`
    }

    if (this.currentFilters['deleted'] != '') paramString = paramString + `&deleted=${this.currentFilters['deleted']}`;
    // if (this.currentFilters['fromDate'] != '') paramString = paramString + `&start_time=${this.currentFilters['fromDate']}`;
    // if (this.currentFilters['toDate'] != '') paramString = paramString + `&end_time=${this.currentFilters['toDate']}`;
    if (this.currentFilters['sortorder'] != '') paramString = paramString + `&sort_order=${this.currentFilters['sortorder']}`;
    if (this.currentFilters['query'] != '') paramString = paramString + `&name=${this.currentFilters['query']}`;
    console.log(`paramString: ${paramString}`) 

    this.shopService.getShopList(paramString)
    .then(response => {
      this.rows = response['data']['shops'];
      this.page.totalElements = response['data']['total'];
      this.page.totalPages = response['data']['total'] / this.pageSize;
      this.updateCache(offset, response);
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      this.isLoading = false;
    })
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getShopList();
  }

  onClick(event) {
     if(event.type == 'click') {
        this.router.navigateByUrl(APP_ROUTES.SHOP + "/" + event.row.id);
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

  resetFilters() {
    this.currentFilters['query'] = '';
    this.currentFilters['deleted'] = '';
    this.currentFilters['status'] = '';
    this.currentFilters['sortorder'] = '';
    this.currentFilters['fromDate'] = '';
    this.currentFilters['toDate'] = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  }
}
