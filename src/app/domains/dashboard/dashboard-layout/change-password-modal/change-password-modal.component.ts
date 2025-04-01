import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [
    CommonModule, 
    NzModalModule, 
    ReactiveFormsModule, 
    NzButtonModule, 
    NzInputModule,
    NzButtonModule,
    NzModalModule],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.css'
})
export class ChangePasswordModalComponent {
  @Input() isVisible!:boolean;
  @Output() closeModal = new EventEmitter<void>();

  
  @Output() passwordChanged = new EventEmitter<void>(); // Emitirá evento cuando se cambie la contraseña
  
  passwordForm: FormGroup;


  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\S.*\S$/)]],
      confirmPassword: ['', Validators.required]
    });
  }


  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    if (this.passwordForm.valid) {
      console.log('Contraseña actualizada:', this.passwordForm.value);
      this.passwordChanged.emit(); // Notificar al padre
      this.isVisible = false;
    }
  }

}
