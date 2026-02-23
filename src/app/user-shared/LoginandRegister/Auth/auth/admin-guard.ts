import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth-service';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
 
  const authService = inject(AuthService);
  const router = inject(Router);

  // We listen to the roles stream
  return authService.userRoles$.pipe(
    take(1), // Take the current value and stop listening
    map(roles => {
      if (roles.includes('Writer')) {
        return true; // Let them in!
      }

      // If they are not an Admin, kick them to home
      alert('Access Denied: Admins Only');
      router.navigateByUrl('/');
      return false;
    })
  );

};
