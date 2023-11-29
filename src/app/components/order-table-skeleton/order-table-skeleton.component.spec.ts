import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTableSkeletonComponent } from './order-table-skeleton.component';

describe('OrderTableSkeletonComponent', () => {
  let component: OrderTableSkeletonComponent;
  let fixture: ComponentFixture<OrderTableSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderTableSkeletonComponent]
    });
    fixture = TestBed.createComponent(OrderTableSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
