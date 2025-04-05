import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { GraphqlService } from '../app/services/graphql.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private client;

  constructor(private graphql: GraphqlService) {
    // Initialize Apollo Client from custom GraphQL service
    this.client = this.graphql.getClient();
  }

  // Store JWT token in browser's localStorage
  private saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  // Clear JWT token from localStorage
  private clearToken() {
    localStorage.removeItem('auth_token');
  }

  // Retrieve JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * GraphQL Mutation: Sign up a new user
   * @param username - unique username
   * @param email - valid email address
   * @param password - password (validated server-side)
   * @returns Apollo mutation Observable
   */
  signup(username: string, email: string, password: string) {
    return this.client.mutate({
      mutation: gql`
        mutation Signup(
          $username: String!
          $email: String!
          $password: String!
        ) {
          signup(username: $username, email: $email, password: $password) {
            id
            username
            email
          }
        }
      `,
      variables: { username, email, password },
    });
  }

  /**
   * GraphQL Mutation: Authenticate user and store token
   * @param username - login username
   * @param password - login password
   * @returns Observable with login result
   */
  login(username: string, password: string) {
    return this.client
      .mutate({
        mutation: gql`
          mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              token
              user {
                id
                username
                email
              }
            }
          }
        `,
        variables: { username, password },
      })
      .pipe(
        // Intercept response to store token on successful login
        (source) =>
          new Observable((observer) => {
            source.subscribe({
              next: (result: any) => {
                const token = result.data?.login?.token;
                if (token) this.saveToken(token);
                observer.next(result);
                observer.complete();
              },
              error: (err) => observer.error(err),
            });
          })
      );
  }

  /**
   * GraphQL Query: Get current user (from backend using token)
   * @returns Apollo query Observable
   */
  me() {
    return this.client.query({
      query: gql`
        query Me {
          me {
            id
            username
            email
          }
        }
      `,
      fetchPolicy: 'no-cache', // Always re-fetch to verify session
    });
  }

  /**
   * Local logout: Clear token & emit success
   * @returns Observable that emits true
   */
  logout() {
    this.clearToken(); // Clear from storage
    return new Observable((observer) => {
      observer.next(true); // Emit "success"
      observer.complete();
    });
  }
}
