import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitComponentComponent } from './submit-component.component';

describe('SubmitComponentComponent', () => {
  let component: SubmitComponentComponent;
  let fixture: ComponentFixture<SubmitComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
