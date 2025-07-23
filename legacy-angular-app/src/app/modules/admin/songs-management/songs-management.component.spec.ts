import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsManagementComponent } from './songs-management.component';

describe('SongsManagementComponent', () => {
  let component: SongsManagementComponent;
  let fixture: ComponentFixture<SongsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
