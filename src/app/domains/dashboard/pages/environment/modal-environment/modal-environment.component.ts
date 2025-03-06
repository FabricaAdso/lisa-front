import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-modal-environment',
  standalone: true,
  imports: [
    NzFormModule,
    CommonModule,
    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule
  ],
  templateUrl: './modal-environment.component.html',
  styleUrl: './modal-environment.component.css'
})

export class ModalEnvironmentComponent {
  
   form = inject(FormBuilder).group({
      name: ['', Validators.required],
      address: [''],
    });
  isVisible = true


  closeModal() {
    this.isVisible = true
  }
}
