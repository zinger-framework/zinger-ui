import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent implements OnInit {
  @Input() inputType = 'text';
  @Input() placeholder = '';
  @Input() formControlName = this.inputType;
  @Input() isRequired = true;

  constructor() { }

  ngOnInit(): void {
  }
}
