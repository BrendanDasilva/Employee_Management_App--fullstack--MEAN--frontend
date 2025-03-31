import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.router.navigate(['/employees']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
