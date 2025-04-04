import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return firstValueFrom(auth.me())
    .then((result: any) => {
      if (result.data?.me) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
    .catch((err) => {
      console.warn('Guard check failed:', err);
      router.navigate(['/login']);
      return false;
    });
};
