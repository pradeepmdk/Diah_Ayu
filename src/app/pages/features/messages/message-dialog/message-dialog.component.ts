import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesStore } from '../../../../../core/store/messages.store';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent {
  messageForm: FormGroup;
  private messagesStore = inject(MessagesStore);
  submitting = this.messagesStore.submitting;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MessageDialogComponent>
  ) {
    this.messageForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });  
    effect(() => {
      if (this.messagesStore.success()) {
        setTimeout(() => {
          this.dialogRef.close();
          this.messagesStore.resetSuccess();
        }, 100);
      }
    });
  
  }

  submitForm(): void {
    if (this.messageForm.valid) {
      console.log(this.messageForm.value);
      this.messagesStore.submitMessage(this.messageForm.value);
      // this.dialogRef.close(this.messageForm.value);
    }
  }
}