import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBooksFilterComponent } from './side-books-filter.component';

describe('SideBooksFilterComponent', () => {
  let component: SideBooksFilterComponent;
  let fixture: ComponentFixture<SideBooksFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SideBooksFilterComponent]
    });
    fixture = TestBed.createComponent(SideBooksFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
