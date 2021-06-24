import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExtendedFormControl} from "../../core/utils/extended-form-control.utils";

@Component({
  selector: 'reason-modal',
  templateUrl: './reason-modal.component.html',
  styleUrls: ['./reason-modal.component.css']
})
export class ReasonModalComponent implements OnInit {

  @Input() title;
  @Output() updateStatus: EventEmitter<{title: string, formObject: FormGroup}> = new EventEmitter();

  reasonForm: FormGroup;
  
  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {
    this.reasonForm = this.fb.group({
      reason: new ExtendedFormControl('', [Validators.required, Validators.maxLength(250)], 'reason'),
      className: 'reason'
    })
  }

  ngOnInit(): void {
  }

  onSubmit(status){
    this.updateStatus.emit({title: this.title, formObject: this.reasonForm})    
  }

}
