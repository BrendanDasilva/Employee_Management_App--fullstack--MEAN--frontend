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
  // Form model for new employee
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

  // File input (optional image upload placeholder for future use)
  selectedImage: File | null = null;

  // UI state variables
  errorMessage = '';
  successMessage = '';
  loading = false;

  // Used to restrict date picker
  today: string = new Date().toISOString().split('T')[0];

  // Used by child component to trigger a reset
  resetTrigger = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  // Submit form: call backend to add employee
  onSubmit() {
    this.loading = true;

    this.employeeService.addEmployee(this.employee).subscribe({
      next: () => {
        // Show success and clear form on success
        this.successMessage = 'Employee added successfully!';
        this.errorMessage = '';
        this.loading = false;

        // Reset form fields
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

        // Trigger reset in child form (optional hook for file input)
        this.resetTrigger = true;

        // Clear success message after 5s
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err: any) => {
        console.error('Error adding employee:', err);
        this.errorMessage = 'Failed to add employee.';
        this.successMessage = '';
        this.loading = false;
      },
    });
  }

  // Navigate back to employee list without saving
  onCancel() {
    this.router.navigate(['/employees']);
  }
}
