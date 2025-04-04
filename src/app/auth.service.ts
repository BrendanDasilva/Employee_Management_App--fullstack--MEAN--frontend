import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { GraphqlService } from '../app/services/graphql.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private client;

  constructor(private graphql: GraphqlService) {
    this.client = this.graphql.getClient();
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
    return this.client.mutate({
      mutation: gql`
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: { username, password },
      context: {
        fetchOptions: {
          credentials: 'include',
        },
      },
    });
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
      context: {
        fetchOptions: {
          credentials: 'include',
        },
      },
      fetchPolicy: 'no-cache',
    });
  }

  logout() {
    return this.client.mutate({
      mutation: gql`
        mutation Logout {
          logout
        }
      `,
      context: {
        fetchOptions: {
          credentials: 'include',
        },
      },
    });
  }
}
