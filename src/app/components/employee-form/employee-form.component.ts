import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
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
export class EmployeeFormComponent implements OnChanges {
  @ViewChild('addForm') addForm!: NgForm;

  @Input() resetTrigger: boolean = false;
  @Input() employee: any = {
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    designation: '',
    department: '',
    date_of_joining: '',
    salary: 0,
    employee_photo: '',
  };
  @Input() isEditMode: boolean = false;
  @Input() errorMessage: string = '';
  @Input() successMessage: string = '';
  @Input() loading: boolean = false;
  @Input() today: string = '';

  @Output() submitForm = new EventEmitter<FormData>();
  @Output() cancel = new EventEmitter<void>();

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetTrigger'] && this.resetTrigger && this.addForm) {
      this.addForm.resetForm();
      this.imagePreview = null;
      this.selectedFile = null;
    }
  }

  onSubmit() {
    const formData = new FormData();

    for (const key in this.employee) {
      if (this.employee[key] !== undefined && this.employee[key] !== null) {
        formData.append(key, this.employee[key]);
      }
    }

    if (this.selectedFile) {
      formData.append('employee_photo', this.selectedFile);
    }

    this.submitForm.emit(formData);
  }

  onCancel() {
    this.cancel.emit();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
