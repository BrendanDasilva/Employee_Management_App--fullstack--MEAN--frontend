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

  selectedImage: File | null = null;
  errorMessage = '';
  successMessage = '';
  loading = false;
  today: string = new Date().toISOString().split('T')[0];
  resetTrigger = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;

    this.employeeService.addEmployee(this.employee).subscribe({
      next: () => {
        this.successMessage = 'Employee added successfully!';
        this.errorMessage = '';
        this.loading = false;

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

        this.resetTrigger = true;

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

  onCancel() {
    this.router.navigate(['/employees']);
  }
}
