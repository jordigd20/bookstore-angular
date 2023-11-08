import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingFormComponent } from './rating-form.component';

describe('RatingFormComponent', () => {
  let component: RatingFormComponent;
  let fixture: ComponentFixture<RatingFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RatingFormComponent]
    });
    fixture = TestBed.createComponent(RatingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
