import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopApprovalComponent } from './shop-approval.component';

describe('ShopApprovalComponent', () => {
  let component: ShopApprovalComponent;
  let fixture: ComponentFixture<ShopApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
