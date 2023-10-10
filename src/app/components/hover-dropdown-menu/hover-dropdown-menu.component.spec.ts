import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverDropdownMenuComponent } from './hover-dropdown-menu.component';

describe('HoverDropdownMenuComponent', () => {
  let component: HoverDropdownMenuComponent;
  let fixture: ComponentFixture<HoverDropdownMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HoverDropdownMenuComponent]
    });
    fixture = TestBed.createComponent(HoverDropdownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
