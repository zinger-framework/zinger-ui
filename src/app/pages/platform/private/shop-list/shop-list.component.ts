import {Component, OnInit} from '@angular/core';
import {ShopService} from "../../../../core/service/platform/shop.service";
import {SortType, ColumnMode} from "@swimlane/ngx-datatable"
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';
import {ToastrService} from 'ngx-toastr';
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css']
})
export class ShopListComponent implements OnInit {

  rows = [];
  isLoading = false;
  statuses = ['PENDING', 'ACTIVE', 'INACTIVE', 'BLOCKED']
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
  rangeDate: NgbDate | null;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private shopService: ShopService) {

    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);

    this.shopSearchForm = this.fb.group({
      query: new ExtendedFormControl('', [], 'query'),
      status: new ExtendedFormControl('ACTIVE', [], 'status'),
      startDate: new ExtendedFormControl('', [], 'startDate'),
      endDate: new ExtendedFormControl('', [], 'endDate'),
      sortOrder: new ExtendedFormControl('', [], 'sortOrder'),
      className: 'shop-search'
    });
  }

  ngOnInit(): void {
    this.getShopList();
  }

  getShopList() {
    this.isLoading = true;
    this.shopService.getShopList()
    .then(response => {
      this.isLoading = true;
      this.rows = response['data']['shops']
    })
    .catch(error => {
      this.isLoading = true;
      console.log(error)
    })
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.rangeDate = this.formatter.format(this.fromDate).toLocaleString() + ' to ' + this.formatter.format(this.toDate).toLocaleString()
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

}
