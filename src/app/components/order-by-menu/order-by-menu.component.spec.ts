import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderByMenuComponent } from './order-by-menu.component';

describe('OrderByMenuComponent', () => {
  let component: OrderByMenuComponent;
  let fixture: ComponentFixture<OrderByMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderByMenuComponent]
    });
    fixture = TestBed.createComponent(OrderByMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
