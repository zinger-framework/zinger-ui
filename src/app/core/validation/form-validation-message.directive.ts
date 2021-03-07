import {Directive, ElementRef, Host, Input, OnChanges, Optional, SimpleChanges, SkipSelf} from '@angular/core';
import {ControlContainer, FormControl} from '@angular/forms';
import {FormValidationMessageService} from './form-validation-message.service';

@Directive({
  selector: '[formValidationMessage]'
})
export class FormValidationMessageDirective implements OnChanges {

  @Input()
  controlValue: string;

  @Input()
  touched: string;

  @Input()
  control: FormControl;

  @Input()
  label: string;

  @Input()
  apiError: string = "";

  @Input()
  parentRef: ElementRef<HTMLElement>;

  parentElement: any;

  constructor(
    @Optional() @Host() @SkipSelf() private parent: ControlContainer,
    private formErrorService: FormValidationMessageService,
    private el: ElementRef
  ) {
    this.formErrorService.parent = this.parent;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['apiError'] != null) {
      let errorMsg = changes['apiError']['currentValue'].toString();
      (errorMsg.length > 0) ? this.setErrorMessage(errorMsg[0].toUpperCase() + errorMsg.substring(1)) : this.clearErrorMessage();
      return;
    }
    this.validateForm();
  }

  private validateForm(): void {
    this.formErrorService.control = this.control;
    this.formErrorService.label = this.label.split("-").reverse()[0];
    let errorMsg = this.formErrorService.getErrorMessage();
    (errorMsg.length > 0) ? this.setErrorMessage(errorMsg) : this.clearErrorMessage()
  }

  private setErrorMessage(errorMsg: string): void {
    if(this.parentRef==null) return;
    this.parentElement = this.parentRef.nativeElement;
    let lastIndex = this.label.lastIndexOf("-")+1;
    console.log(this.label.toLowerCase().substring(0,lastIndex))
    this.parentElement.querySelector("div."+this.label.toLowerCase().substring(0,lastIndex)+"api-error").innerHTML = ""
    this.parentElement.querySelector("div.form-group-" + this.label.toLowerCase()).classList.add("has-danger");
    this.parentElement.querySelector("div.form-group input#" + this.label.toLowerCase()).classList.add("form-control-danger");
    this.parentElement.querySelector("div#error-" + this.label.toLowerCase()).innerHTML = errorMsg;
  }

  private clearErrorMessage(): void {
    if(this.parentRef==null) return;
    this.parentElement = this.parentRef.nativeElement;
    let lastIndex = this.label.lastIndexOf("-")+1;
    this.parentElement.querySelector("div."+this.label.toLowerCase().substring(0,lastIndex)+"api-error").innerHTML = ""
    this.parentElement.querySelector("div.form-group-" + this.label.toLowerCase()).classList.remove('has-danger');
    this.parentElement.querySelector("div.form-group input#" + this.label.toLowerCase()).classList.remove('form-control-danger');
    this.parentElement.querySelector("div#error-" + this.label.toLowerCase()).innerHTML = "";
  }

}
