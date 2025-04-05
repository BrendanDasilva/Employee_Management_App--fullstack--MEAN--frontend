import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root', // Makes this service available throughout the app
})
export class GraphqlService {
  // Inject Apollo client instance
  constructor(private apollo: Apollo) {}

  /**
   * Returns the Apollo client instance.
   * Used by other services (like AuthService, EmployeeService) to execute queries/mutations.
   */
  getClient(): Apollo {
    return this.apollo;
  }
}
