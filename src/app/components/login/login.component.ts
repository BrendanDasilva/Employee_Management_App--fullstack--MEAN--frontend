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
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: (res: any) => {
        if (res.data?.me) {
          this.router.navigate(['/employees']);
        }
      },
      error: (err: any) => {
        console.warn('User not logged in:', err);
        // Not logged in is okay here — just remain on login screen
      },
    });
  }

  onLogin(): void {
    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.appComponent.checkAuth(); // Refresh navbar state
        this.router.navigate(['/employees']);
      },
      error: (err: any) => {
        this.errorMessage = err.message || 'Login failed';
        console.error('Login error:', err);
      },
    });
  }
}
