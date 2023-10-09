import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordFormComponent } from './password-form.component';

describe('ForgotPasswordFormComponent', () => {
  let component: PasswordFormComponent;
  let fixture: ComponentFixture<PasswordFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PasswordFormComponent]
    });
    fixture = TestBed.createComponent(PasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
