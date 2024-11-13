import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetDTO } from '@shared/dto/password-reset.dto';
import { PasswordResetService } from '@shared/services/password-reset.service';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,],
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  passwordResetForm: FormGroup;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private passwordResetService = inject(PasswordResetService);
  token: string | null = null

  constructor() {
    this.passwordResetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required]]
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    // console.log(this.token);
  }


  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const password_confirmation = formGroup.get('password_confirmation')?.value;
    return password === password_confirmation ? null : { mismatch: true };
  }

  resetPassword() {
    if (this.passwordResetForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const password = this.passwordResetForm.value.password;
    const password_confirmation = this.passwordResetForm.value.password_confirmation;

    if (this.token) {
      const passwordResetDTO: PasswordResetDTO = {
        token: this.token,
        password: password,
        password_confirmation:password_confirmation
      };

      this.passwordResetService.resetPassword(passwordResetDTO).subscribe(
        (response) => {
          console.log('Contraseña restablecida con éxito', response);
          this.router.navigate(['auth/login']);
        },
        (error) => {
          console.error('Error al restablecer la contraseña', error);
        }
      );
    }
  }
}
