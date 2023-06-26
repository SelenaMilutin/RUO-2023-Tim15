import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryViewComponent } from './components/gallery-view/gallery-view.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UploadComponent } from './components/upload/upload.component';

const routes: Routes = [
  {path: 'upload', component: UploadComponent},
  {path: 'view', component: GalleryViewComponent},
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
