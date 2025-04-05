import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  // Form input bindings
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private auth: AuthService, // Auth service for login logic
    private router: Router, // Router for navigation
    private appComponent: AppComponent // Needed to trigger global auth refresh
  ) {}

  ngOnInit(): void {
    // Auto-redirect if already logged in
    this.auth.me().subscribe({
      next: (res: any) => {
        if (res.data?.me) {
          this.router.navigate(['/employees']);
        }
      },
      error: (err: any) => {
        console.warn('User not logged in:', err);
        // No active session, remain on login page
      },
    });
  }

  onLogin(): void {
    // Attempt login with provided credentials
    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.appComponent.checkAuth(); // Update currentUser in navbar
        this.router.navigate(['/employees']); // Redirect to employee dashboard
      },
      error: (err: any) => {
        this.errorMessage = err.message || 'Login failed'; // Show user-friendly error
        console.error('Login error:', err);
      },
    });
  }
}
