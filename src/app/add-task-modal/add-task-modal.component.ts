import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task-modal.component.html',
  styleUrl: './add-task-modal.component.scss'
})
export class AddTaskModalComponent {
  taskName: string = ''; // Variable to hold the task name

  constructor(public dialogRef: MatDialogRef<AddTaskModalComponent>) { }

  // Save the task name and close the dialog
  onSave(): void {
    this.dialogRef.close(this.validateText(this.taskName));
  }

  // Close the dialog without saving
  onCancel(): void {
    this.dialogRef.close();
  }

  /* will not allow all special characters except numbers and alphabets*/
  validateText(value: any) {
    value = value.replace(/[.,'_*+?^$<>=+/#@!%&`~|;:"\-{}()|[\]\\]/g, "")
    // to prevent consecutive spaces
    value = value.replace(/ +/g, " ");
    return value
  }

}
