import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { HeadquarterModel } from '@shared/models/headquarter.model';
import { HeadquartersService } from '@shared/services/headquarters.service';

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

  formHeadquarter!:FormGroup;

  @Output() updatedHeadquarter: EventEmitter<void> = new EventEmitter();
  @Input() headquarterData?: HeadquarterModel|null;

  private headquarterService = inject(HeadquartersService)


  isVisibleHeadquarter = true


  ngOnInit(): void {
    this.formHeadquarter = new FormGroup({
      name: new FormControl(null, Validators.required),
      adress: new FormControl(null, Validators.required),
      opening_time: new FormControl(null, Validators.required),
      closing_time: new FormControl(null, Validators.required),
      municipality: new FormControl(null, Validators.required),
      id: new FormControl(null),
      training_center_id: new FormControl(null)
    });
  }

  setData(data: HeadquarterModel): void {
    this.headquarterData = data;

    this.formHeadquarter.patchValue({
      name: data.name,
      adress: data.adress,
      opening_time: data.opening_time,
      closing_time: data.closing_time,
      municipality: data.municipality,
      id: data.id,
      training_center_id: data.training_center_id
    });
  }

  editHeadquarter(): void {
    if (this.formHeadquarter.invalid) {
      console.log('Formulario no válido');
      this.formHeadquarter.markAllAsTouched();
      return;
    }

    const data = this.formHeadquarter.value;
    data.id = this.headquarterData?.id;

    // Aquí limpiamos los segundos de la hora
    data.opening_time = this.removeSeconds(data.opening_time);
    data.closing_time = this.removeSeconds(data.closing_time);

    console.log('Datos enviados:', data);

    this.headquarterService.update(data).subscribe({
      next: (res) => {
        console.log('Sede actualizada correctamente', res);
        this.isVisibleHeadquarter = true;
        this.formHeadquarter.reset();
        this.updatedHeadquarter.emit();
      },
      error: (err) => {
        console.error('Error al actualizar sede', err);
      }
    });
  }

  removeSeconds(time: string): string {
    if (!time) return '';
    return time.substring(0, 5); // Corta los segundos y deja solo HH:mm
  }


  closeModal() {
    this.isVisibleHeadquarter = true
    this.formHeadquarter.reset();

  
  }





}
