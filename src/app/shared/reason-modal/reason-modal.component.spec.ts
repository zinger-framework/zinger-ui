import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonModalComponent } from './reason-modal.component';

describe('ReasonModalComponent', () => {
  let component: ReasonModalComponent;
  let fixture: ComponentFixture<ReasonModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReasonModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
