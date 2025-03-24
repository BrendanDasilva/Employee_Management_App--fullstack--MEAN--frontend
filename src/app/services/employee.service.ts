import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const GET_ALL_EMPLOYEES = gql`
  query {
    getAllEmployees {
      id
      first_name
      last_name
      email
      designation
      department
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees(): Observable<any[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_ALL_EMPLOYEES,
      })
      .valueChanges.pipe(map((result) => result.data.getAllEmployees));
  }
}
