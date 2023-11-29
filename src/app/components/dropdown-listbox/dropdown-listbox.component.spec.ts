import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownListboxComponent } from './dropdown-listbox.component';

describe('DropdownListboxComponent', () => {
  let component: DropdownListboxComponent;
  let fixture: ComponentFixture<DropdownListboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DropdownListboxComponent]
    });
    fixture = TestBed.createComponent(DropdownListboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
