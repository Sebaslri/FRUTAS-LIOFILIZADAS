import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material.module';
import { RouterLink } from '@angular/router';

export interface LoginPromptData {
  moduleName: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-login-prompt-modal',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './login-prompt-modal.component.html',
  styleUrl: './login-prompt-modal.component.css',
})
export class LoginPromptModalComponent {
  constructor(
    public dialogRef: MatDialogRef<LoginPromptModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LoginPromptData,
  ) { }

  close(): void {
    this.dialogRef.close();
  }
}
