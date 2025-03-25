import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GraphqlService } from '../../services/graphql.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
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

  viewEmployee(emp: any) {
    console.log('View employee:', emp);
  }

  editEmployee(emp: any) {
    console.log('Edit employee:', emp);
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.graphql.deleteEmployee(id).then(
        () => {
          this.employees = this.employees.filter((emp) => emp.id !== id);
        },
        (err) => {
          console.error('Delete failed:', err);
        }
      );
    }
  }
}
