import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonBandComponentComponent } from './common-band-component.component';

describe('CommonBandComponentComponent', () => {
  let component: CommonBandComponentComponent;
  let fixture: ComponentFixture<CommonBandComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonBandComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonBandComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
