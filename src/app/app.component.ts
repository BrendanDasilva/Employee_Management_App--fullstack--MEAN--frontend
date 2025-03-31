import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {}

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('token');
    }
    return false;
  }

  logout() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
}
