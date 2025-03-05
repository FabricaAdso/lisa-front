import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-headquarter',
  standalone: true,
  imports: [
    NzFormModule,
    CommonModule,
    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule

  ],
  templateUrl: './modal-headquarter.component.html',
  styleUrl: './modal-headquarter.component.css'
})
export class ModalHeadquarterComponent {

  form = inject(FormBuilder).group({
    name: ['', Validators.required],
    address: [''],
  });

  constructor(public modal: NzModalService) {}

  submitForm(): void {
    if (this.form.valid) {
      this.modal.close(this.form.value); // Cierra el modal y devuelve los datos
    }
  }

  closeModal(): void {
    this.modal.close(); // Cierra el modal sin enviar datos
  }


}
