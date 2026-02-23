import { Routes } from '@angular/router';
import { Login } from './admin/login/login';
import { AddPoem } from './admin/add-poem/add-poem';
import { UploadPhoto } from './admin/upload-photo/upload-photo';
import { Gallery } from './gallery/gallery';
import { Dashboard } from './admin/dashboard/dashboard';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: 'admin/login', component: Login },

  { path: 'admin/dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  { path: 'admin/add-poem',
    component: AddPoem,
    canActivate: [authGuard]
  },

  { path: 'admin/upload-photo',
    component: UploadPhoto,
    canActivate: [authGuard]
  },

  { path: 'gallery', component: Gallery }
];