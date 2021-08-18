import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExtendedFormControl} from "../../core/utils/extended-form-control.utils";
import {BaseComponent} from "../../base.component";

@Component({
  selector: 'reason-modal',
  templateUrl: './reason-modal.component.html',
  styleUrls: ['./reason-modal.component.css']
})

export class ReasonModalComponent extends BaseComponent {
  @Input() title;
  @Output() updateStatus: EventEmitter<{ title: string, formObject: FormGroup }> = new EventEmitter();
  reasonForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {
    super();
    this.reasonForm = this.fb.group({
      reason: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'reason'),
      className: 'reason'
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.updateStatus.emit({title: this.title, formObject: this.reasonForm})
  }
}
