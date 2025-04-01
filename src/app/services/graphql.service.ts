import { Injectable } from '@angular/core';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { HttpLink } from '@apollo/client/link/http';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  private client: ApolloClient<any>;

  constructor() {
    const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

    this.client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
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
      variables: {
        ...employeeData,
      },
    });
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
      fetchPolicy: 'no-cache',
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
      variables: { id },
      fetchPolicy: 'no-cache',
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
      variables: {
        id,
        ...updatedData,
      },
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
      variables: { id },
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
      variables: { designation, department },
      fetchPolicy: 'no-cache',
    });
  }

  // ====== Auth: Signup Mutation ======
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

  // ====== Auth: Login Mutation ======
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
          credentials: 'include', // Send and receive cookies
        },
      },
    });
  }

  // ====== Auth: Me Query ======
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

  // ====== Auth: Logout Mutation ======
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
