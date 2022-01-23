import {Component, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ColumnMode} from '@swimlane/ngx-datatable'
import {BaseComponent} from '../../../../base.component';
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';

@Component({
  selector: 'app-platform-config',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.css']
})
export class ConfigListComponent extends BaseComponent {
  readonly headerHeight = 50;
  readonly rowHeight = 50;
  readonly pageLimit = 10;
  totalElements = 0
  isLoading = true
  endReached = false
  rows = []
  ColumnMode = ColumnMode
  configForm: FormGroup
  tagSuggestions = [];

  details = {
    types: ['Food', 'Fashion'],
    categories: {
      'Food': ['North India', 'chinese', 'south india', 'beverages', 'dessert', 'biriyani', 'fast-food', 'kebab'],
      'Fashion': ['shirts', 'jackets', 'jeans', 'ethnic_wear', 'accessories', 'footwear', 'innerwear']
    },
    variantProperty: {'Food': ['quantity', 'size'], 'Fashion': ['size', 'color']}
  }

  constructor(private fb: FormBuilder, private el: ElementRef,) {
    super()
    this.configForm = this.fb.group({
      type: new ExtendedFormControl(null, [Validators.required], 'type'),
      categories: new ExtendedFormControl(null, [Validators.required], 'categories'),
      variants: new ExtendedFormControl(null, [Validators.required], 'variants'),
      filters: new ExtendedFormControl(null, [Validators.required], 'filters'),
      className: 'platform-config'
    });
  }

  getConfigList() {

  }

  updateConfig(): void {
    console.log(this.configForm.value);
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
      this.getConfigList()
    }
  }
}
