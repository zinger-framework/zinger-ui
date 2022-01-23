import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {BaseComponent} from '../../../../base.component';
import {ExtendedFormControl} from '../../../../core/utils/extended-form-control.utils';

@Component({
  selector: 'app-platform-config',
  templateUrl: './platform-config.component.html',
  styleUrls: ['./platform-config.component.css']
})
export class PlatformConfigComponent extends BaseComponent {
  platformConfigForm: FormGroup
  tagSuggestions = [];

  details = {
    types: ['Food', 'Fashion'],
    categories: {
      'Food': ['North India', 'chinese', 'south india', 'beverages', 'dessert', 'biriyani', 'fast-food', 'kebab'],
      'Fashion': ['shirts', 'jackets', 'jeans', 'ethnic_wear', 'accessories', 'footwear', 'innerwear']
    },
    variantProperty: {'Food': ['quantity', 'size'], 'Fashion': ['size', 'color']}

  }

  constructor(private fb: FormBuilder) {
    super()
    this.platformConfigForm = this.fb.group({
      type: new ExtendedFormControl(null, [Validators.required], 'type'),
      categories: new ExtendedFormControl(null, [Validators.required], 'categories'),
      variants: new ExtendedFormControl(null, [Validators.required], 'variants'),
      filters: new ExtendedFormControl(null, [Validators.required], 'filters'),
      className: 'platform-config'
    });
  }

  ngOnInit(): void {
  }

  updateConfig(): void {
    console.log(this.platformConfigForm.value);
  }
}