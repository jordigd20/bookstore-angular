import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperCheckoutComponent } from './stepper-checkout.component';

describe('StepperCheckoutComponent', () => {
  let component: StepperCheckoutComponent;
  let fixture: ComponentFixture<StepperCheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StepperCheckoutComponent]
    });
    fixture = TestBed.createComponent(StepperCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
