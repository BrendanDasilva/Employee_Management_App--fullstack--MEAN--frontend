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
    this.client = this.graphql.getClient();
  }

  private saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  private clearToken() {
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

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
        // Store token on login success
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
      fetchPolicy: 'no-cache',
    });
  }

  logout() {
    this.clearToken(); // Just nuke it on the frontend
    return new Observable((observer) => {
      observer.next(true);
      observer.complete();
    });
  }
}
