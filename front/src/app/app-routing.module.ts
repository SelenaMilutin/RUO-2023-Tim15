import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryViewComponent } from './components/gallery-view/gallery-view.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UploadComponent } from './components/upload/upload.component';
import { InviteFamilyComponent } from './components/invite-family/invite-family.component';
import { RegisterByInvitationComponent } from './components/register-by-invitation/register-by-invitation.component';
import { VerifyRegistrationComponent } from './components/verify-registration/verify-registration.component';
import { EditComponent } from './components/edit/edit.component';

const routes: Routes = [
  {path: 'upload', component: UploadComponent},
  {path: 'view', component: GalleryViewComponent},
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'inviteFamily', component: InviteFamilyComponent},
  {path: "registerByInvitation", component: RegisterByInvitationComponent},
  {path: "verifyRegistation", component: VerifyRegistrationComponent},
  {path: "edit", component: EditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
