import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsManagementComponent } from './ads-management.component';

describe('AdsManagementComponent', () => {
  let component: AdsManagementComponent;
  let fixture: ComponentFixture<AdsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
