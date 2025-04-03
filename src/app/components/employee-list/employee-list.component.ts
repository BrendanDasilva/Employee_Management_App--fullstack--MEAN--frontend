import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GraphqlService } from '../../services/graphql.service';

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

  // Track if view mode was forced due to screen size
  private wasAutoSwitched = false;

  constructor(private graphql: GraphqlService) {}

  ngOnInit(): void {
    this.loadAllEmployees();

    // Initial view based on screen size
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

    // Optional: You could reset this if needed
    if (width > 991 && this.wasAutoSwitched) {
      this.wasAutoSwitched = false;
    }
  }

  loadAllEmployees() {
    this.loading = true;
    this.graphql.getAllEmployees().then(
      (result: any) => {
        this.allEmployees = result.data.getAllemployees;
        this.employees = [...this.allEmployees];
        this.loading = false;
      },
      (err: any) => {
        this.error = err;
        this.loading = false;
      }
    );
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
      this.graphql.deleteEmployee(id).then(
        () => {
          this.employees = this.employees.filter((emp) => emp.id !== id);
          this.allEmployees = this.allEmployees.filter((emp) => emp.id !== id);
        },
        (err) => {
          console.error('Delete failed:', err);
        }
      );
    }
  }

  // Manual toggle
  setViewMode(mode: 'list' | 'card') {
    this.viewMode = mode;
    this.wasAutoSwitched = false; // cancel auto mode if user makes a choice
  }
}
