import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterByInvitationComponent } from './register-by-invitation.component';

describe('RegisterByInvitationComponent', () => {
  let component: RegisterByInvitationComponent;
  let fixture: ComponentFixture<RegisterByInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterByInvitationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterByInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
