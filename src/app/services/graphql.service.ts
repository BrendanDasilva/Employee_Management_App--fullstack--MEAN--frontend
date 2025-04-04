import { Injectable } from '@angular/core';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  private client: ApolloClient<any>;

  constructor() {
    const httpLink = new HttpLink({
      uri: environment.graphqlUri,
    });

    const link = ApolloLink.from([httpLink]);

    this.client = new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  }

  getClient(): ApolloClient<any> {
    return this.client;
  }
}
