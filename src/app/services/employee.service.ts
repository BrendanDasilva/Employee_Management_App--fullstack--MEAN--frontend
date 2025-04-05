import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { GraphqlService } from './graphql.service';

@Injectable({
  providedIn: 'root', // This makes the service globally available
})
export class EmployeeService {
  private client;

  constructor(private graphql: GraphqlService) {
    // Retrieve the Apollo client instance from the wrapper service
    this.client = this.graphql.getClient();
  }

  // ====== Get All Employees Query ======
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
            salary
          }
        }
      `,
      fetchPolicy: 'no-cache', // Always fetch fresh data from server (no caching)
    });
  }

  // ====== Get Employee by ID Query ======
  getEmployeeByEID(id: string) {
    return this.client.query({
      query: gql`
        query GetEmployeeByEID($id: ID!) {
          getEmployeeByEID(id: $id) {
            id
            first_name
            last_name
            email
            gender
            designation
            department
            salary
            date_of_joining
          }
        }
      `,
      variables: { id }, // Pass dynamic variable for employee ID
      fetchPolicy: 'no-cache', // Ensure up-to-date info
    });
  }

  // ====== Add Employee Mutation ======
  addEmployee(employeeData: any) {
    return this.client.mutate({
      mutation: gql`
        mutation AddEmployee(
          $first_name: String!
          $last_name: String!
          $email: String!
          $gender: String!
          $designation: String!
          $salary: Float!
          $date_of_joining: String!
          $department: String!
        ) {
          addEmployee(
            first_name: $first_name
            last_name: $last_name
            email: $email
            gender: $gender
            designation: $designation
            salary: $salary
            date_of_joining: $date_of_joining
            department: $department
          ) {
            id
          }
        }
      `,
      variables: { ...employeeData }, // Spread input into GraphQL variables
    });
  }

  // ====== Update Employee Query ======
  updateEmployee(id: string, updatedData: any) {
    return this.client.mutate({
      mutation: gql`
        mutation UpdateEmployee(
          $id: ID!
          $first_name: String!
          $last_name: String!
          $email: String!
          $designation: String!
          $department: String!
          $salary: Float!
        ) {
          updateEmployee(
            id: $id
            first_name: $first_name
            last_name: $last_name
            email: $email
            designation: $designation
            department: $department
            salary: $salary
          ) {
            id
          }
        }
      `,
      variables: { id, ...updatedData }, // Combine ID with updated fields
    });
  }

  // ====== Employee: Delete ======
  deleteEmployee(id: string) {
    return this.client.mutate({
      mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployee(id: $id)
        }
      `,
      variables: { id }, // ID of employee to delete
    });
  }

  // ====== Employee: Search ======
  searchEmployees(designation: string, department: string) {
    return this.client.query({
      query: gql`
        query SearchEmployees($designation: String, $department: String) {
          searchEmployees(designation: $designation, department: $department) {
            id
            first_name
            last_name
            email
            designation
            department
            salary
          }
        }
      `,
      variables: { designation, department }, // Filter criteria
      fetchPolicy: 'no-cache', // Avoid stale results
    });
  }
}
