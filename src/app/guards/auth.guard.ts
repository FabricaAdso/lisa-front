import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  if (token) {
    console.log('Token encontrado:', token);
    return true; // El usuario está autenticado
  } else {
    console.log('Token no encontrado, redirigiendo al login');
    return router.createUrlTree(['auth/login']);
  }
};
