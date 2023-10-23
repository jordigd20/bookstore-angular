import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalCardSkeletonComponent } from './vertical-card-skeleton.component';

describe('VerticalCardSkeletonComponent', () => {
  let component: VerticalCardSkeletonComponent;
  let fixture: ComponentFixture<VerticalCardSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VerticalCardSkeletonComponent]
    });
    fixture = TestBed.createComponent(VerticalCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
