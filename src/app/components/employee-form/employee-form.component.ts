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
  // Reference to the form in the template
  @ViewChild('addForm') addForm!: NgForm;

  // Flag to externally trigger a form reset (used by parent component)
  @Input() resetTrigger: boolean = false;

  // The employee data object used to populate form fields (editable or new)
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

  // Determines whether this form is in "Edit" or "Add" mode
  @Input() isEditMode: boolean = false;

  // Optional error message to show in the form
  @Input() errorMessage: string = '';

  // Optional success message to show in the form
  @Input() successMessage: string = '';

  // Whether the form is currently processing a request (to show spinners/loaders)
  @Input() loading: boolean = false;

  // Today's date passed from parent to validate date_of_joining
  @Input() today: string = '';

  // Emits the filled FormData when the form is submitted
  @Output() submitForm = new EventEmitter<FormData>();

  // Emits when the user cancels (to navigate back or clear UI)
  @Output() cancel = new EventEmitter<void>();

  // File selected for upload (employee photo)
  selectedFile: File | null = null;

  // Image preview for selected photo (used in the UI)
  imagePreview: string | ArrayBuffer | null = null;

  // Detect changes to @Input values (mainly resetTrigger)
  ngOnChanges(changes: SimpleChanges) {
    // Reset form and file preview when resetTrigger is flipped
    if (changes['resetTrigger'] && this.resetTrigger && this.addForm) {
      this.addForm.resetForm();
      this.imagePreview = null;
      this.selectedFile = null;
    }
  }

  // Form submission logic
  onSubmit() {
    const formData = new FormData();

    // Append all employee fields to the FormData payload
    for (const key in this.employee) {
      if (this.employee[key] !== undefined && this.employee[key] !== null) {
        formData.append(key, this.employee[key]);
      }
    }

    // Append file if selected
    if (this.selectedFile) {
      formData.append('employee_photo', this.selectedFile);
    }

    // Emit the FormData object to the parent component
    this.submitForm.emit(formData);
  }

  // Handle cancel action (emit back to parent)
  onCancel() {
    this.cancel.emit();
  }

  // Handle file selection and show preview
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create image preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
