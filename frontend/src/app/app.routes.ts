import { Routes } from '@angular/router';
import { Login } from './admin/login/login';
import { AddPoem } from './admin/add-poem/add-poem';
import { UploadPhoto } from './admin/upload-photo/upload-photo';
import { Gallery } from './gallery/gallery';
import { Dashboard } from './admin/dashboard/dashboard';
import { authGuard } from './auth-guard';
import {Home} from './home/home';
import {Poems} from './poems/poems';
import {GalleryPublic} from './gallery-public/gallery-public';
import {About} from './about/about';



export const routes: Routes = [
  { path: 'admin/login', component: Login },

  //public routes
  {path:'', component: Home},
  {path:'poems', component: Poems},
  {path:'gallery', component: GalleryPublic},
  {path:'about',component: About},

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