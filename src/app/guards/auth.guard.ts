import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth.service';

// Define a route guard to protect routes from unauthorized access
export const authGuard: CanActivateFn = () => {
  // Inject the required services
  const auth = inject(AuthService);
  const router = inject(Router);

  // Perform the "me" query to check if a user session exists
  return firstValueFrom(auth.me())
    .then((result: any) => {
      // If user data exists, allow access
      if (result.data?.me) {
        return true;
      } else {
        // If no user is authenticated, redirect to login page
        router.navigate(['/login']);
        return false;
      }
    })
    .catch((err) => {
      // Handle failed request (e.g., expired token or network issue)
      console.warn('Guard check failed:', err);
      router.navigate(['/login']);
      return false;
    });
};
