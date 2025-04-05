import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  // List of currently displayed employees (may be filtered)
  employees: any[] = [];

  // Full list of employees (used for filtering/search)
  allEmployees: any[] = [];

  // State flags
  loading = true;
  error: any;

  // Search input string
  searchTerm: string = '';

  // Toggle between list and card views
  viewMode: 'list' | 'card' = 'list';

  // Used to track if view was automatically switched due to screen size
  private wasAutoSwitched = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadAllEmployees();

    // Automatically switch to card view for small screens on init
    if (window.innerWidth <= 991) {
      this.viewMode = 'card';
      this.wasAutoSwitched = true;
    }
  }

  // React to window resize to toggle view for responsive behavior
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const width = event.target.innerWidth;

    // Switch to card mode if screen shrinks
    if (width <= 991 && this.viewMode !== 'card') {
      this.viewMode = 'card';
      this.wasAutoSwitched = true;
    }

    // Re-enable manual toggle once window expands again
    if (width > 991 && this.wasAutoSwitched) {
      this.wasAutoSwitched = false;
    }
  }

  // Load all employees from the backend
  loadAllEmployees() {
    this.loading = true;

    this.employeeService.getAllEmployees().subscribe({
      next: (result: any) => {
        this.allEmployees = result.data.getAllemployees;
        this.employees = [...this.allEmployees]; // Copy for filtering
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load employees:', err);
        this.error = err;
        this.loading = false;
      },
    });
  }

  // Filter employees by designation or department
  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.employees = this.allEmployees.filter(
      (emp) =>
        emp.designation?.toLowerCase().includes(term) ||
        emp.department?.toLowerCase().includes(term)
    );
  }

  // Reset the search input and restore the full list
  resetSearch() {
    this.searchTerm = '';
    this.employees = [...this.allEmployees];
  }

  // Delete an employee after confirmation
  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          // Update both local lists to reflect deletion
          this.employees = this.employees.filter((emp) => emp.id !== id);
          this.allEmployees = this.allEmployees.filter((emp) => emp.id !== id);
        },
        error: (err: any) => {
          console.error('Delete failed:', err);
        },
      });
    }
  }

  // User manually changes the view (list or card)
  setViewMode(mode: 'list' | 'card') {
    this.viewMode = mode;
    this.wasAutoSwitched = false; // Reset auto toggle override
  }
}
