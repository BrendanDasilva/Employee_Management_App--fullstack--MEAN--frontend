import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphqlService } from '../../services/graphql.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  loading = true;
  error: any;

  constructor(private graphql: GraphqlService) {}

  ngOnInit(): void {
    this.graphql.getAllEmployees().then(
      (result: any) => {
        this.employees = result.data.getAllemployees;
        this.loading = false;
      },
      (err: any) => {
        this.error = err;
        this.loading = false;
      }
    );
  }
}
