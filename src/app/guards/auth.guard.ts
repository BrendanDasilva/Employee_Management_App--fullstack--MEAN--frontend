import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { GraphqlService } from '../services/graphql.service';
import { Router } from '@angular/router';
import { firstValueFrom, from } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const graphql = inject(GraphqlService);
  const router = inject(Router);

  try {
    const result = await graphql.me();
    if (result.data.me) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  } catch {
    router.navigate(['/login']);
    return false;
  }
};
