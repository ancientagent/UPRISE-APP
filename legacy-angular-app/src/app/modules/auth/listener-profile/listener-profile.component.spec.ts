import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListenerProfileComponent } from './listener-profile.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


describe('ListenerProfileComponent', () => {
  let component: ListenerProfileComponent;
  let fixture: ComponentFixture<ListenerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListenerProfileComponent ],
      imports : [ ReactiveFormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListenerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
