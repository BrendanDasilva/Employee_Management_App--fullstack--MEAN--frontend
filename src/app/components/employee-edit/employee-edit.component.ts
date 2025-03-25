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

  constructor(
    private route: ActivatedRoute,
    private graphql: GraphqlService,
    private router: Router
  ) {}

  ngOnInIt() {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.graphql.getEmployeeById(this.employeeId).then(
      (result: any) => {
        this.employee = result.data.getEmployeeById;
        this.loading = false;
      },
      (err: any) => {
        this.error = err;
        this.loading = false;
      }
    );
  }

  onUpdateEmployee() {
    this.graphql
      .updateEmployee(this.employeeId, this.employee)
      .then(() => {
        this.router.navigate(['/employees']);
      })
      .catch((err) => {
        this.error = err;
      });
  }
}
