import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitComponenet2Component } from './submit-componenet2.component';

describe('SubmitComponenet2Component', () => {
  let component: SubmitComponenet2Component;
  let fixture: ComponentFixture<SubmitComponenet2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitComponenet2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitComponenet2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
