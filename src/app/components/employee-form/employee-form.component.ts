import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.component.html',
})
export class EmployeeFormComponent {
  @ViewChild('addForm') addForm!: NgForm;

  @Input() resetTrigger: boolean = false; // 👈 added
  ngOnChanges() {
    if (this.resetTrigger && this.addForm) {
      this.addForm.resetForm();
    }
  }

  @Input() employee: any = {
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    designation: '',
    department: '',
    date_of_joining: '',
    salary: 0,
  };
  @Input() isEditMode: boolean = false;
  @Input() errorMessage: string = '';
  @Input() successMessage: string = '';
  @Input() loading: boolean = false;
  @Input() today: string = ''; // <-- Add this

  @Output() submitForm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit() {
    this.submitForm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
