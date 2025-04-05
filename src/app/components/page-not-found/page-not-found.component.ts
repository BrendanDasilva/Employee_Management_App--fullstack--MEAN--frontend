import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service'; // Added to check session

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    // Optional: preload logic if needed in the future
  }

  // Method to navigate user back to a meaningful route depending on auth state
  goHome() {
    // Check actual session validity using backend `me()` call
    this.auth.me().subscribe({
      next: (res: any) => {
        if (res.data?.me) {
          // If user is authenticated, redirect to employee list
          this.router.navigate(['/employees']);
        } else {
          // If not authenticated, redirect to login page
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        // Fallback: if the query fails, send to login
        this.router.navigate(['/login']);
      },
    });
  }
}
