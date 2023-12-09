import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorWarningComponent } from './error-warning.component';

describe('ErrorWarningComponent', () => {
  let component: ErrorWarningComponent;
  let fixture: ComponentFixture<ErrorWarningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ErrorWarningComponent]
    });
    fixture = TestBed.createComponent(ErrorWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
