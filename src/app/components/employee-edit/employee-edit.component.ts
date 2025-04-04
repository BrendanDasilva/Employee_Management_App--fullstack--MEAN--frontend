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
  employeeId: string = '';

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

  loading = true;
  error: any;
  errorMessage: string = '';
  successMessage: string = '';
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';

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

  onUpdateEmployee() {
    this.loading = true;

    this.employeeService
      .updateEmployee(this.employeeId, this.employee)
      .subscribe({
        next: () => {
          this.successMessage = 'Employee updated successfully!';
          this.errorMessage = '';
          this.loading = false;

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

  onCancel() {
    this.router.navigate(['/employees']);
  }
}
