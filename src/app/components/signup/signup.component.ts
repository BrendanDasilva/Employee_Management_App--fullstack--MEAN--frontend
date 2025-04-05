import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../app.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  // Form fields
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    // If user is already logged in, redirect to employees list
    this.auth.me().subscribe({
      next: (res: any) => {
        if (res.data?.me) {
          this.router.navigate(['/employees']);
        }
      },
      error: (err: any) => {
        console.warn('User not logged in (signup page):', err);
      },
    });
  }

  onSignUp(): void {
    // Check if passwords match before attempting signup
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Call signup mutation
    this.auth.signup(this.username, this.email, this.password).subscribe({
      next: () => {
        // On successful signup, automatically log the user in
        this.auth.login(this.username, this.password).subscribe({
          next: () => {
            // Update app state and navigate to protected route
            this.appComponent.checkAuth();
            this.router.navigate(['/employees']);
          },
          error: () => {
            this.errorMessage = 'Signup succeeded, but login failed.';
          },
        });
      },
      error: (err: any) => {
        this.errorMessage = err.message || 'Sign up failed.';
        console.error('Signup error:', err);
      },
    });
  }
}
