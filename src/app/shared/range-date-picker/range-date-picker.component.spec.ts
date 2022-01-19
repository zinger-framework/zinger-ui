import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RangedatepickerComponent} from './rangedatepicker.component';

describe('RangedatepickerComponent', () => {
  let component: RangedatepickerComponent;
  let fixture: ComponentFixture<RangedatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RangedatepickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangedatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
