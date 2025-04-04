import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeFormComponent],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss',
})
export class EmployeeAddComponent {
  // Default employee structure
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

  // Image file (optional)
  selectedImage: File | null = null;

  // Error and success messages
  errorMessage = '';
  successMessage = '';
  loading = false;
  today: string = new Date().toISOString().split('T')[0];

  // Used to trigger form reset
  resetTrigger = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;

    // // Prepare FormData for image upload
    // const formData = new FormData();
    // for (const key in this.employee) {
    //   formData.append(key, this.employee[key]);
    // }

    // // Append image if selected
    // if (this.selectedImage) {
    //   formData.append('employee_photo', this.selectedImage);
    // }

    // Call GraphQL service to add employee
    this.employeeService.addEmployee(this.employee).then(
      () => {
        this.successMessage = 'Employee added successfully!';
        this.errorMessage = '';
        this.loading = false;

        // Reset form
        this.employee = {
          first_name: '',
          last_name: '',
          email: '',
          gender: '',
          designation: '',
          department: '',
          date_of_joining: '',
          salary: 0,
        };

        // Trigger reset
        this.resetTrigger = true;

        // Clear success message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      (err) => {
        this.errorMessage = 'Failed to add employee.';
        this.successMessage = '';
        this.loading = false;
      }
    );
  }

  onCancel() {
    this.router.navigate(['/employees']);
  }
}
