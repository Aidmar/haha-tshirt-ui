import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth-service';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  authService.loadUserFromStorage();

  return authService.userRoles$.pipe(
    take(1), 
    map(roles => {
      if (roles.includes('Writer')) {
        return true; 
      }

      alert('Access Denied: You need Admin (Writer) permissions to view this page.');
      router.navigateByUrl('/login');
      return false;
    })
  );
};
