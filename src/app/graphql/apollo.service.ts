import { Injectable } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  constructor(private httpLink: HttpLink) {}

  createApollo(): ApolloClientOptions<any> {
    return {
      link: this.httpLink.create({
        uri: 'http://localhost:4000/graphql', // replace with  backend URI when hosted
      }),
      cache: new InMemoryCache(),
    };
  }
}

export function provideApollo(apolloService: ApolloService) {
  return apolloService.createApollo();
}
