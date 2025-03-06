import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { HeadquarterModel } from '@shared/models/headquarter.model';

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


  @Input() headquarterData!: HeadquarterModel; // Recibe los datos desde el padre
  @Output() saveData = new EventEmitter<HeadquarterModel>(); // Evento para emitir los datos actualizados


  isVisibleHeadquarter = true
  form = inject(FormBuilder).group({
    name: ['', Validators.required],
    adress: ['', Validators.required],
    opening_time: ['', Validators.required],
    closing_time: ['', Validators.required],
    municipality: ['', Validators.required],


  });

  closeModal() {
    this.isVisibleHeadquarter = true
  }
  setData(data: HeadquarterModel) {
    this.form.patchValue({
      name: data.name,
      adress: data.adress,
      opening_time: data.opening_time,
      closing_time: data.closing_time,
      municipality: data.municipality,
    });
    this.isVisibleHeadquarter = false;
  }

  save(): void {
    if (this.form.valid) {
      const updatedData: HeadquarterModel = {
        ...this.headquarterData,
        ...this.form.value,
        name: this.form.value.name ?? '',
        adress: this.form.value.adress ?? '',
        opening_time: this.form.value.opening_time ?? '',
        closing_time: this.form.value.closing_time ?? '',
        municipality: this.form.value.municipality ?? ''
      };
      this.saveData.emit(updatedData); // Emitimos los datos actualizados
      this.isVisibleHeadquarter = false; // Cerramos el modal
    }
  }


}
