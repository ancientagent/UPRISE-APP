import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandMemberlistComponent } from './brand-memberlist.component';

describe('BrandMemberlistComponent', () => {
  let component: BrandMemberlistComponent;
  let fixture: ComponentFixture<BrandMemberlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandMemberlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandMemberlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
