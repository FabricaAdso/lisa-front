import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetDTO } from '@shared/dto/password-reset.dto';
import { PasswordResetService } from '@shared/services/password-reset.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  passwordResetForm: FormGroup;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private passwordResetService = inject(PasswordResetService);
  token: string | null = null;

  constructor() {
    // **Aquí se aplica el validador personalizado**
    this.passwordResetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator } // Conectamos el validador personalizado aquí
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  // **Este es el validador personalizado**
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const password_confirmation = formGroup.get('password_confirmation')?.value;
    return password === password_confirmation ? null : { 'mismatch': true };
  }

  showNotification(message: string) {
    const notificationElement = document.getElementById('notification');
    if (notificationElement) {
      notificationElement.innerText = message;
      notificationElement.classList.remove('hidden');
      setTimeout(() => {
        notificationElement.classList.add('hidden');
      }, 3000);
    }
  }


  resetPassword() {
    if (this.passwordResetForm.invalid) {
      if (this.passwordResetForm.errors && this.passwordResetForm.errors['mismatch']) {
        alert('Las contraseñas no coinciden. Por favor, verifica e inténtalo de nuevo.');
      } else {
        alert('Por favor, completa todos los campos correctamente.');
      }
      return;
    }

    const password = this.passwordResetForm.value.password;
    const password_confirmation = this.passwordResetForm.value.password_confirmation;

    if (this.token) {
      const passwordResetDTO: PasswordResetDTO = {
        token: this.token,
        password: password,
        password_confirmation: password_confirmation,
      };

      this.passwordResetService.resetPassword(passwordResetDTO).subscribe(
        (response) => {
          this.showNotification('Contraseña restablecida correctamente'); // Mostrar la notificación
          setTimeout(() => {
            this.router.navigate(['auth/login']); // Redirigir después de 3 segundos
          }, 3000);
        },
        (error) => {
          console.error('Error al restablecer la contraseña', error);
        }
      );
    }
  }
}
