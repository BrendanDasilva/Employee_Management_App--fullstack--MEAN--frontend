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

  constructor(private graphql: GraphqlService) {}

  ngOnInit(): void {
    this.loadAllEmployees();

    // Set initial view based on screen size
    if (window.innerWidth <= 991) {
      this.viewMode = 'card';
    }
  }

  // Automatically switch view on window resize
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= 991) {
      this.viewMode = 'card';
    } else {
      this.viewMode = 'list';
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

  viewEmployee(emp: any) {
    console.log('View employee:', emp);
  }

  editEmployee(emp: any) {
    console.log('Edit employee:', emp);
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

  // Toggle between list and card views
  toggleView() {
    this.viewMode = this.viewMode === 'list' ? 'card' : 'list';
  }
}
