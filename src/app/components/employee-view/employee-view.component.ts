import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.scss',
})
export class EmployeeViewComponent implements OnInit {
  employeeId: string = ''; // ID pulled from the route
  employee: any; // Fetched employee data
  errorMessage = ''; // Error message for display
  loading = true; // Loading state toggle

  constructor(
    private route: ActivatedRoute, // To access route parameters
    private employeeService: EmployeeService // Employee service for fetching data
  ) {}

  ngOnInit(): void {
    // Get employee ID from the route
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';

    // Fetch employee by ID
    this.employeeService.getEmployeeByEID(this.employeeId).subscribe({
      next: (result: any) => {
        // Success: Set employee data and stop loading
        this.employee = result.data.getEmployeeByEID;
        this.loading = false;
      },
      error: (err: any) => {
        // Error handling
        console.error('Error loading employee data', err);
        this.errorMessage = 'Failed to load employee data';
        this.loading = false;
      },
    });
  }
}
