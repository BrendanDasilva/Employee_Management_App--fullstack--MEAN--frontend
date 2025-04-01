import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GraphqlService } from '../../services/graphql.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeFormComponent],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
})
export class EmployeeEditComponent implements OnInit {
  employeeId: string = '';

  // Employee data object
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

  // Optional image
  selectedImage: File | null = null;

  // Error and success messages
  loading = true;
  error: any;
  errorMessage: string = '';
  successMessage: string = '';
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private graphql: GraphqlService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get ID from route and fetch employee data
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.graphql.getEmployeeByEID(this.employeeId).then(
      (result: any) => {
        this.employee = result.data.getEmployeeByEID;
        this.loading = false;
      },
      (err: any) => {
        this.errorMessage = 'Failed to load employee data.';
        this.loading = false;
      }
    );
  }

  onUpdateEmployee() {
    this.loading = true;

    // Convert data to FormData for image support
    const formData = new FormData();
    for (const key in this.employee) {
      if (this.employee[key] !== undefined) {
        formData.append(key, this.employee[key]);
      }
    }

    // Append image file if available
    if (this.selectedImage) {
      formData.append('employee_photo', this.selectedImage);
    }

    // Call GraphQL service to update employee
    this.graphql.updateEmployee(this.employeeId, this.employee).then(
      () => {
        this.successMessage = 'Employee updated successfully!';
        this.errorMessage = '';
        this.loading = false;

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      (err) => {
        this.errorMessage = 'Failed to update employee.';
        this.successMessage = '';
        this.loading = false;
      }
    );
  }

  onCancel() {
    this.router.navigate(['/employees']);
  }
}
