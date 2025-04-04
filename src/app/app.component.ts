import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  currentUser: any = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth(): void {
    this.auth.me().subscribe({
      next: (res: any) => {
        this.currentUser = res.data.me;
      },
      error: () => {
        this.currentUser = null;
      },
    });
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.currentUser = null;
        this.router.navigate(['/login']);
      },
      error: () => {
        // Optional: Show error toast or retry logic
        console.error('Logout failed');
      },
    });
  }
}
