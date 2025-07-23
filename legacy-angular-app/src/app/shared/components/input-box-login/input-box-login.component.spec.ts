import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBoxLoginComponent } from './input-box-login.component';

describe('InputBoxLoginComponent', () => {
  let component: InputBoxLoginComponent;
  let fixture: ComponentFixture<InputBoxLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputBoxLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputBoxLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
