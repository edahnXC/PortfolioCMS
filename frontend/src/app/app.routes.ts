import { Routes } from '@angular/router';
import { Login } from './admin/login/login';
import { AddPoem } from './admin/add-poem/add-poem';
import { UploadPhoto } from './admin/upload-photo/upload-photo';

export const routes: Routes = [
  { path: 'admin/login', component: Login },
  { path: 'admin/add-poem', component: AddPoem },
  { path: 'admin/upload-photo', component: UploadPhoto }
];