import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GraphqlService } from '../../services/graphql.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(private graphql: GraphqlService, private router: Router) {}

  onSignUp() {
    this.graphql.signup(this.username, this.email, this.password).then(
      () => {
        this.router.navigate(['/login']);
      },
      (err) => {
        this.errorMessage = err.message;
      }
    );
  }
}
