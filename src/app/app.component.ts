import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], // Using standalone component style
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  // Holds the currently logged-in user's data
  currentUser: any = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuth(); // Check user session when app starts
  }

  // Verifies if the user is logged in by calling the 'me' GraphQL query
  checkAuth(): void {
    this.auth.me().subscribe({
      next: (res: any) => {
        this.currentUser = res.data.me; // Save user data to display in navbar, etc.
      },
      error: () => {
        this.currentUser = null; // If token invalid or expired, clear user
      },
    });
  }

  // Utility to check login status (used in templates)
  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  // Logs user out and redirects to login page
  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.currentUser = null; // Clear local state
        this.router.navigate(['/login']); // Navigate to login screen
      },
      error: () => {
        // You can show a toast/snackbar here in production
        console.error('Logout failed');
      },
    });
  }
}
