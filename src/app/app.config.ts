import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide router and app routes
    provideRouter(routes),

    // Provide Angular's native HTTP client (plus any interceptors if added later)
    provideHttpClient(withInterceptors([])),

    // Import essential modules for Apollo and HttpClient usage
    importProvidersFrom(HttpClientModule, ApolloModule),

    // Provide Apollo configuration (used by GraphqlService)
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        // Create an auth link to add the Authorization header to every request
        const authLink = setContext(() => {
          const token = localStorage.getItem('auth_token');
          return {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          };
        });

        // Combine authLink and HTTP link for GraphQL requests
        const link = ApolloLink.from([
          authLink, // Sets auth header
          httpLink.create({
            uri: 'https://employeemanagementapp-backend.onrender.com/graphql', // Backend GraphQL endpoint
          }),
        ]);

        return {
          cache: new InMemoryCache(), // Caching for better performance
          link, // Final link used by Apollo Client
        };
      },
      deps: [HttpLink], // Inject HttpLink for useFactory
    },
  ],
};
