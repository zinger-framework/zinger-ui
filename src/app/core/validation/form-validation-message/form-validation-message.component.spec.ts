import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValidationMessageComponent } from './form-validation-message.component';

describe('FormValidationMessageComponent', () => {
  let component: FormValidationMessageComponent;
  let fixture: ComponentFixture<FormValidationMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormValidationMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormValidationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
