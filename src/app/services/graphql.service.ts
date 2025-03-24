import { Injectable } from '@angular/core';
import {
  ApolloClient,
  InMemoryCache,
  gql,
  NormalizedCacheObject,
} from '@apollo/client/core';
import { HttpLink } from '@apollo/client/link/http';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  private client: ApolloClient<NormalizedCacheObject>;

  constructor() {
    this.client = new ApolloClient({
      link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
      cache: new InMemoryCache(),
    });
  }

  getAllEmployees() {
    return this.client.query({
      query: gql`
        query {
          getAllemployees {
            id
            first_name
            last_name
            email
            designation
            department
          }
        }
      `,
    });
  }
}
