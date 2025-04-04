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
    provideRouter(routes),
    provideHttpClient(withInterceptors([])),
    importProvidersFrom(HttpClientModule, ApolloModule),
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const authLink = setContext(() => ({
          credentials: 'include',
        }));

        const link = ApolloLink.from([
          authLink,
          httpLink.create({
            uri: 'https://employeemanagementapp-backend.onrender.com/graphql',
          }),
        ]);

        return {
          cache: new InMemoryCache(),
          link,
        };
      },
      deps: [HttpLink],
    },
  ],
};
