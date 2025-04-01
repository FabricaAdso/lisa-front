import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordService } from '@shared/services/change-password.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';


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
    NzModalModule,
    NzIconModule

  ],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.css'
})
export class ChangePasswordModalComponent {
  @Input() isVisible!:boolean;
  @Output() closeModal = new EventEmitter<void>();
  @Output() passwordChanged = new EventEmitter<{ currentPassword: string, newPassword: string, newPasswordConfirmation: string }>();
  passwordForm: FormGroup;

  // Estado inicial para cada campo de contraseña
  isCurrentPasswordVisible = false;
  isNewPasswordVisible = false;
  isConfirmPasswordVisible = false;
 

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\S.*\S$/)]],
      confirmPassword: ['', Validators.required]
    });
  }

 
  togglePasswordVisibility(field: string): void {
    if (field === 'currentPassword') {
      this.isCurrentPasswordVisible = !this.isCurrentPasswordVisible;
      // Después de 1 segundo, ocultar la contraseña nuevamente
      setTimeout(() => {
        this.isCurrentPasswordVisible = false;
      }, 1000);
    } else if (field === 'newPassword') {
      this.isNewPasswordVisible = !this.isNewPasswordVisible;
      // Después de 3 segundos, ocultar la contraseña nuevamente
      setTimeout(() => {
        this.isNewPasswordVisible = false;
      }, 1000);
    } else if (field === 'confirmPassword') {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
      // Después de 3 segundos, ocultar la contraseña nuevamente
      setTimeout(() => {
        this.isConfirmPasswordVisible = false;
      }, 1000);
    }
  }



  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

      // Verificación de que las contraseñas coinciden
      if (newPassword !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      this.passwordChanged.emit({
        currentPassword,
        newPassword,
        newPasswordConfirmation: confirmPassword
      });
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }

  
  

}
