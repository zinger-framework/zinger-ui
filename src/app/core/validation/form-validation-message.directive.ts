import {Directive, ElementRef, Host, Input, Optional, SkipSelf, DoCheck, OnChanges, SimpleChanges} from '@angular/core';
import {ControlContainer, ControlValueAccessor, FormControl} from '@angular/forms';
import { FormValidationMessageService } from './form-validation-message.service';

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

  apiErrorShown = true;
  parentElement: any;

  constructor(
    @Optional() @Host() @SkipSelf() private parent: ControlContainer,
    private formErrorService: FormValidationMessageService,
    private el: ElementRef
  ) {
    this.formErrorService.parent = this.parent;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['apiError']!=null){
      let errorMsg = changes['apiError']['currentValue'];
      (errorMsg.length>0)?this.setErrorMessage(errorMsg.split(":")[0]):this.clearErrorMessage();
      console.log("return called");
      return;
    }
    this.validateForm();
  }

  private validateForm(): void {
    this.formErrorService.control = this.control;
    this.formErrorService.label = this.label;
    let errorMsg = this.formErrorService.getErrorMessage();
    (errorMsg.length>0)? this.setErrorMessage(errorMsg): this.clearErrorMessage()
  }

  private setErrorMessage(errorMsg: string): void{
    console.log("set called: "+errorMsg);
    this.parentElement = this.el.nativeElement.parentElement.parentElement.parentElement;
    this.parentElement.querySelector("div.form-group-" + this.label).classList.add("has-danger");
    this.parentElement.querySelector("div.form-group input#" + this.label).classList.add("form-control-danger");
    this.parentElement.querySelector("div#error-" + this.label).innerText = "\t" + errorMsg;
  }

  private clearErrorMessage(): void{
    console.log("clear called");
    this.parentElement = this.el.nativeElement.parentElement.parentElement.parentElement;
    this.parentElement.querySelector("div.form-group-"+this.label).classList.remove('has-danger');
    this.parentElement.querySelector("div.form-group input#"+this.label).classList.remove('form-control-danger');
    this.parentElement.querySelector("div#error-"+this.label).innerText = "";
  }

}
