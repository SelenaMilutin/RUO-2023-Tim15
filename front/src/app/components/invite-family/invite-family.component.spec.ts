import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFamilyComponent } from './invite-family.component';

describe('InviteFamilyComponent', () => {
  let component: InviteFamilyComponent;
  let fixture: ComponentFixture<InviteFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteFamilyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
