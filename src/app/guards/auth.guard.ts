import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export function authGuard(): boolean {
  if (typeof window !== 'undefined' && window.localStorage) {
    return !!localStorage.getItem('token');
  }
  return false;
}
