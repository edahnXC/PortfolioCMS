import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (!isExpired) {
        return true;
      }
    } catch (e) {
      // Invalid token format
    }
  }
  
  localStorage.removeItem('token');
  router.navigate(['/manage/portal-login']);
  return false;
};