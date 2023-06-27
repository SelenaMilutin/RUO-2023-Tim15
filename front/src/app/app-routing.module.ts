import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UploadComponent } from './components/upload/upload.component';
import { InviteFamilyComponent } from './components/invite-family/invite-family.component';
import { RegisterByInvitationComponent } from './components/register-by-invitation/register-by-invitation.component';
import { VerifyRegistrationComponent } from './components/verify-registration/verify-registration.component';

const routes: Routes = [
  {path: 'upload', component: UploadComponent},
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'inviteFamily', component: InviteFamilyComponent},
  {path: "registerByInvitation", component: RegisterByInvitationComponent},
  {path: "verifyRegistation", component: VerifyRegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
