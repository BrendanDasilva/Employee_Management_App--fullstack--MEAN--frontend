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
  employees: any[] = [];
  allEmployees: any[] = [];
  loading = true;
  error: any;
  searchTerm: string = '';
  viewMode: 'list' | 'card' = 'list';

  private wasAutoSwitched = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadAllEmployees();

    if (window.innerWidth <= 991) {
      this.viewMode = 'card';
      this.wasAutoSwitched = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const width = event.target.innerWidth;

    if (width <= 991 && this.viewMode !== 'card') {
      this.viewMode = 'card';
      this.wasAutoSwitched = true;
    }

    if (width > 991 && this.wasAutoSwitched) {
      this.wasAutoSwitched = false;
    }
  }

  loadAllEmployees() {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (result: any) => {
        this.allEmployees = result.data.getAllemployees;
        this.employees = [...this.allEmployees];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load employees:', err);
        this.error = err;
        this.loading = false;
      },
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.employees = this.allEmployees.filter(
      (emp) =>
        emp.designation?.toLowerCase().includes(term) ||
        emp.department?.toLowerCase().includes(term)
    );
  }

  resetSearch() {
    this.searchTerm = '';
    this.employees = [...this.allEmployees];
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.employees = this.employees.filter((emp) => emp.id !== id);
          this.allEmployees = this.allEmployees.filter((emp) => emp.id !== id);
        },
        error: (err: any) => {
          console.error('Delete failed:', err);
        },
      });
    }
  }

  setViewMode(mode: 'list' | 'card') {
    this.viewMode = mode;
    this.wasAutoSwitched = false;
  }
}
