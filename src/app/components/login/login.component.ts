import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GraphqlService } from '../../services/graphql.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private graphql: GraphqlService, private router: Router) {}

  onLogin() {
    this.graphql.login(this.username, this.password).then(
      (result) => {
        localStorage.setItem('token', result.data.login.token);
        this.router.navigate(['/employees']);
      },
      (err) => {
        this.errorMessage = err.message;
      }
    );
  }
}
