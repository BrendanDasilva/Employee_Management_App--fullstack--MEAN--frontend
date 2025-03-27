import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { GraphqlService } from '../../services/graphql.service';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.scss',
})
export class EmployeeViewComponent implements OnInit {
  employeeId: string = '';
  employee: any;
  errorMessage = '';
  loading = true;

  constructor(private route: ActivatedRoute, private graphql: GraphqlService) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.graphql.getEmployeeByEID(this.employeeId).then(
      (result: any) => {
        this.employee = result.data.getEmployeeByEID;
        this.loading = false;
      },
      (err) => {
        this.errorMessage = 'Failed to load employee data';
        this.loading = false;
      }
    );
  }
}
