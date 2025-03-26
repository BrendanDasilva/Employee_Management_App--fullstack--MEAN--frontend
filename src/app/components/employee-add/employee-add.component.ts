import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GraphqlService } from '../../services/graphql.service';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss',
})
export class EmployeeAddComponent {
  employee: any = {
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    designation: '',
    department: '',
    date_of_joining: '',
    salary: 0,
  };
  errorMessage = '';
  loading = false;

  constructor(private graphql: GraphqlService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.graphql.addEmployee(this.employee).then(
      () => {
        this.router.navigate(['/employees']);
      },
      (err) => {
        this.errorMessage = 'Failed to add employee.';
        this.loading = false;
      }
    );
  }

  onCancel() {
    this.router.navigate(['/employees']);
  }
}
