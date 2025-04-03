import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ChangePasswordService } from '@shared/services/change-password.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap, tap } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';


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
  @Input() isVisible!: boolean;
  @Output() closeModal = new EventEmitter<void>();
  @Output() passwordChanged = new EventEmitter<{ currentPassword: string, newPassword: string, newPasswordConfirmation: string }>();
  passwordForm: FormGroup;
  submitted = false;

  isPasswordValid: boolean | null = null;
  formInteracted = false; //  bandera para detectar interacción


  // Estado inicial para cada campo de contraseña
  isCurrentPasswordVisible = false;
  isNewPasswordVisible = false;
  isConfirmPasswordVisible = false;


  constructor(
    private fb: FormBuilder,
    private changePasswordService: ChangePasswordService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?!\s)(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).*(?!\s)$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatch });
  }





  ngOnInit(): void {
    // Validación en tiempo real para currentPassword
    this.passwordForm.get('currentPassword')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((password) => {
          if (!password) {
            this.isPasswordValid = null;
            return of({ valid: false });
          }
          this.formInteracted = true; // Marcar interacción cuando escribe aquí
          return this.validateCurrentPassword(password);
        })
      )
      .subscribe((response) => {
        this.isPasswordValid = response.valid;
        const currentPasswordControl = this.passwordForm.get('currentPassword');
        if (!response.valid && currentPasswordControl?.value) {
          currentPasswordControl.setErrors({ incorrect: true });
        } else if (response.valid) {
          // Si es válida, elimina el error 'incorrect' pero conserva otros (como required)
          const { incorrect, ...remainingErrors } = currentPasswordControl?.errors || {};
          currentPasswordControl?.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
        }
        this.changeDetector.detectChanges();
      });

    // Validación en tiempo real para newPassword
    this.passwordForm.get('newPassword')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((newPassword) => {
        this.formInteracted = true; // Marcar interacción cuando escribe aquí
        const currentPassword = this.passwordForm.get('currentPassword')?.value;
        if (newPassword && currentPassword && newPassword === currentPassword) {
          this.passwordForm.get('newPassword')?.setErrors({ sameAsCurrent: true });
        } else if (this.passwordForm.get('newPassword')?.errors?.['sameAsCurrent']) {
          const { sameAsCurrent, ...remainingErrors } = this.passwordForm.get('newPassword')?.errors || {};
          this.passwordForm.get('newPassword')?.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
        }
        this.changeDetector.detectChanges();
      });

    // Opcional: también para confirmPassword si quieres consistencia
    this.passwordForm.get('confirmPassword')?.valueChanges
      .subscribe(() => {
        this.formInteracted = true; // Marcar interacción
        this.changeDetector.detectChanges();
      });
  }




  validateCurrentPassword(currentPassword: string): Observable<{ valid: boolean }> {
    return this.changePasswordService.checkCurrentPassword(currentPassword).pipe(
      catchError(() => of({ valid: false })) // Maneja errores de la API
    );
  }

  passwordsMatch(formGroup: AbstractControl) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { notMatching: true };
  }







  togglePasswordVisibility(field: string): void {
    if (field === 'currentPassword') {
      this.isCurrentPasswordVisible = !this.isCurrentPasswordVisible;
      setTimeout(() => this.isCurrentPasswordVisible = false, 1000);
    } else if (field === 'newPassword') {
      this.isNewPasswordVisible = !this.isNewPasswordVisible;
      setTimeout(() => this.isNewPasswordVisible = false, 1000);
    } else if (field === 'confirmPassword') {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
      setTimeout(() => this.isConfirmPasswordVisible = false, 1000);
    }
  }




  handleCancel(): void {
    this.isVisible = false;
  }


  handleOk(): void {
    this.submitted = true;

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    // Emitir los datos al padre en lugar de hacer la llamada al servicio aquí
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    this.passwordChanged.emit({
      currentPassword,
      newPassword,
      newPasswordConfirmation: confirmPassword
    });
  }




}
