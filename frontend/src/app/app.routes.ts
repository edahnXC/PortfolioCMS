import { Routes } from '@angular/router';
import { Login } from './admin/login/login';
import { AddPoem } from './admin/add-poem/add-poem';

export const routes: Routes = [
  { path: 'admin/login', component: Login },
  { path: 'admin/add-poem', component: AddPoem }
];