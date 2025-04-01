import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GraphqlService } from './services/graphql.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  currentUser: any = null;

  constructor(private graphql: GraphqlService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth(): void {
    this.graphql.me().then(
      (res: any) => {
        this.currentUser = res.data.me;
      },
      () => {
        this.currentUser = null;
      }
    );
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  logout(): void {
    this.graphql.logout().then(() => {
      this.currentUser = null;
      this.router.navigate(['/login']);
    });
  }
}
