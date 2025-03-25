import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GraphqlService } from '../../services/graphql.service';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss',
})
export class EmployeeEditComponent {
  employeeId: string = '';
  employee: any = {
    first_name: '',
    last_name: '',
    email: '',
    designation: '',
    department: '',
  };
  loading = true;
  error: any;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private graphql: GraphqlService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.graphql.getEmployeeByEID(this.employeeId).then(
      (result: any) => {
        this.employee = result.data.getEmployeeByEID;
        this.loading = false;
      },
      (err: any) => {
        this.errorMessage = 'Failed to load employee data.';
        this.loading = false;
      }
    );
  }

  onUpdateEmployee() {
    this.graphql.updateEmployee(this.employeeId, this.employee).then(
      () => {
        this.router.navigate(['/employees']);
      },
      (err) => {
        this.errorMessage = 'Failed to update employee.';
      }
    );
  }

  onCancel() {
    this.router.navigate(['/employees']);
  }
}
