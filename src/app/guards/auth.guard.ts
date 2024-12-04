import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuth()) {
    return true;
  } else {
    // router.navigateByUrl('/error_401');
    const urlTreeReturn = router.createUrlTree(['/dashboard','error_401'])
    return urlTreeReturn;
  }
};
