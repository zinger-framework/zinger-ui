import { Directive, ElementRef, Host, Input, Optional, SkipSelf, DoCheck } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { FormValidationMessageService } from './form-validation-message.service';

@Directive({
  selector: '[formValidationMessage]'
})
export class FormValidationMessageDirective implements DoCheck {

  @Input()
  controlName: string;

  @Input()
  control: FormControl;

  @Input()
  label: string;

  constructor(
    @Optional() @Host() @SkipSelf() private parent: ControlContainer,
    private formErrorService: FormValidationMessageService,
    private el: ElementRef
  ) {
    this.formErrorService.parent = this.parent;
  }

  ngDoCheck() {
    this.executeLogic();
  }

  private executeLogic(): void {
    this.formErrorService.control = this.control;
    this.formErrorService.controlName = this.controlName;
    this.formErrorService.label = this.label;
    this.formErrorService.implementationError();

    let parentElement = this.el.nativeElement.parentElement.parentElement.parentElement;
    if(this.formErrorService.getErrorMessage().length>0){
      parentElement.querySelector("div.form-group-"+this.label).classList.add("has-danger");
      parentElement.querySelector("div.form-group input#"+this.label).classList.add("form-control-danger");
      parentElement.querySelector("div#error-"+this.label).innerHTML = "\t"+this.formErrorService.getErrorMessage();
    }else{
      parentElement.querySelector("div.form-group-"+this.label).classList.remove('has-danger');
      parentElement.querySelector("div.form-group input#"+this.label).classList.remove('form-control-danger');
      parentElement.querySelector("div#error-"+this.label).innerHTML = "";
    }
  }

}
