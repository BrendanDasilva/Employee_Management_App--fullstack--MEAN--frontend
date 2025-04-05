import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeFormComponent],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
})
export class EmployeeEditComponent implements OnInit {
  // The ID of the employee to edit, extracted from route
  employeeId: string = '';

  // Holds the employee data for binding to the form
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

  // Placeholder for file input (not used in update mutation currently)
  selectedImage: File | null = null;

  // UI state flags and messages
  loading = true;
  error: any;
  errorMessage: string = '';
  successMessage: string = '';
  today: string = new Date().toISOString().split('T')[0]; // Used to limit date input

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve employee ID from route parameters
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';

    // Load employee data to populate form
    this.employeeService.getEmployeeByEID(this.employeeId).subscribe({
      next: (result: any) => {
        this.employee = result.data.getEmployeeByEID;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load employee data', err);
        this.errorMessage = 'Failed to load employee data.';
        this.loading = false;
      },
    });
  }

  // Called when the form is submitted to update employee details
  onUpdateEmployee() {
    this.loading = true;

    this.employeeService
      .updateEmployee(this.employeeId, this.employee)
      .subscribe({
        next: () => {
          this.successMessage = 'Employee updated successfully!';
          this.errorMessage = '';
          this.loading = false;

          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err: any) => {
          console.error('Update failed:', err);
          this.errorMessage = 'Failed to update employee.';
          this.successMessage = '';
          this.loading = false;
        },
      });
  }

  // Navigates back to employee list on cancel
  onCancel() {
    this.router.navigate(['/employees']);
  }
}
