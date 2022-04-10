import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemConfigListComponent} from './item-config-list.component';

describe('ItemConfigListComponent', () => {
  let component: ItemConfigListComponent;
  let fixture: ComponentFixture<ItemConfigListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemConfigListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
