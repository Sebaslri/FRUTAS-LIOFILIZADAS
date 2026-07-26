import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

const canAccessAuthenticatedRoute = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/signin']);
};

export const authGuard: CanActivateFn = canAccessAuthenticatedRoute;
export const authChildGuard: CanActivateChildFn = canAccessAuthenticatedRoute;
