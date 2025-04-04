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
    this.auth.me().then((res: any) => {
      if (res.data.me) {
        this.router.navigate(['/employees']);
      }
    });
  }

  onSignUp(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.auth.signup(this.username, this.email, this.password).then(
      () => {
        this.auth.login(this.username, this.password).then(
          () => {
            this.appComponent.checkAuth(); // Update app state
            this.router.navigate(['/employees']);
          },
          () => {
            this.errorMessage = 'Signup succeeded, but login failed.';
          }
        );
      },
      (err: any) => {
        this.errorMessage = err.message || 'Sign up failed.';
      }
    );
  }
}
