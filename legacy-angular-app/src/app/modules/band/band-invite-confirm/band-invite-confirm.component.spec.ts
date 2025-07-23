import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandInviteConfirmComponent } from './band-invite-confirm.component';

describe('BandInviteConfirmComponent', () => {
  let component: BandInviteConfirmComponent;
  let fixture: ComponentFixture<BandInviteConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandInviteConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandInviteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
