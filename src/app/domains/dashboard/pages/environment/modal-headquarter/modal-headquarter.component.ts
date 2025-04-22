import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { HeadquarterModel } from '@shared/models/headquarter.model';
import { HeadquartersService } from '@shared/services/headquarters.service';

import { TrainingCenterModel } from '@shared/models/training-center.model';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TrainingCentreService } from '@shared/services/training-centre.service';

@Component({
  selector: 'app-modal-headquarter',
  standalone: true,
  imports: [
    NzFormModule,
    CommonModule,
    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzSelectModule,
  ],
  templateUrl: './modal-headquarter.component.html',
  styleUrl: './modal-headquarter.component.css',
})
export class ModalHeadquarterComponent {

  //Declaracion de variables

  trainingCentersList: TrainingCenterModel[] = [];
  formHeadquarter!: FormGroup;
  isVisibleHeadquarter = false;
  isEdit: boolean = false;



  @Output() updatedHeadquarter: EventEmitter<void> = new EventEmitter();
  @Input() headquarterData?: HeadquarterModel | null;

  
  
  //injeccion de servicios
  private headquarterService = inject(HeadquartersService);
  private trainingCenterService = inject(TrainingCentreService);
  private message = inject(NzMessageService);
  private notification= inject(NzNotificationService);




  // Reiniciar el modal
  resetModal(): void {
    this.isEdit = false; // Desactivar el modo edición
    this.headquarterData = null; // Limpiar los datos de la sede seleccionada
    this.formHeadquarter.reset(); // Reiniciar el formulario
    this.formHeadquarter.get('training_center_id')?.enable(); // Habilitar el campo training_center_id
    this.getTrainingCenters(); // Cargar los centros de formación si es necesario
  }

  ngOnInit(): void {
    this.formData();

  }

  formData(): void {
    this.formHeadquarter = new FormGroup({
      name: new FormControl(null, Validators.required),
      adress: new FormControl(null, Validators.required),
      opening_time: new FormControl(null, Validators.required),
      closing_time: new FormControl(null, Validators.required),
      municipality: new FormControl(null, Validators.required),
      id: new FormControl(null),
      training_center_id: new FormControl(
        null,
        this.isEdit ? null : Validators.required
      ), // Solo requerido en creación
    });

    // Cargar la lista de centros de formación si no estamos en modo edición
    if (!this.isEdit) {
      this.getTrainingCenters();
    }

  }


  //Metodopra traer los centros de formación

  getTrainingCenters() {
    this.trainingCenterService.getCentros().subscribe({
      next: (data) => {
        this.trainingCentersList = data;
      },
    });
  }



  //funcion para recibir los datos al formulario para editarlos

  setData(data: HeadquarterModel): void {
    this.headquarterData = data;
    this.isEdit = true; // Activamos el modo edición

    this.formHeadquarter.patchValue({
      name: data.name,
      adress: data.adress,
      opening_time: data.opening_time,
      closing_time: data.closing_time,
      municipality: data.municipality,
      id: data.id,
      training_center_id: data.training_center_id,
    });
    // Deshabilitar el campo training_center_id en modo edición
    this.formHeadquarter.get('training_center_id')?.disable();
   
  }


  //funcion pra guardar los datos, dependeindo si esta editando o creando una sede

    saveHeadquarter(): void {

    const data = this.formHeadquarter.value;

    // Limpiar los segundos de la hora
    data.opening_time = this.removeSeconds(data.opening_time);
    data.closing_time = this.removeSeconds(data.closing_time);

    if (this.isEdit) {
      // Habilitar temporalmente el campo training_center_id para incluirlo en la solicitud
      
      this.formHeadquarter.get('training_center_id')?.enable();
      data.training_center_id =this.formHeadquarter.get('training_center_id')?.value;
      this.formHeadquarter.get('training_center_id')?.disable(); // Volver a deshabilitar el campo
      
  



      // Si estamos en modo edición, actualizamos
      this.headquarterService.update(data).subscribe({
        next: () => {
          this.resetModal(); // Reiniciar el modal después de guardar
          this.updatedHeadquarter.emit();
          this.isVisibleHeadquarter = false;
          this.notification.success('','Sede actualizada correctamente'); // Mensaje de éxito

        },
        error: (err) => {
          this.message.error('Error al actualizar sede', err);
        },
      });
    } else {
      // Si estamos en modo creación, creamos
      this.headquarterService.create(data).subscribe({
        next: () => {
          this.resetModal(); // Reiniciar el modal después de guardar
          this.updatedHeadquarter.emit();
          this.isVisibleHeadquarter = false;
          this.notification.success('','Sede creada correctamente'); // Mensaje de éxito
        },
        error: (err) => {
          this.message.error('Error al crear sede', err);
        },
      });
    }
  }

  //funcion para remover los segundos de la hora dejando solo la hora y los minutos
  removeSeconds(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  //funcion pra cerrar el modal

  closeModal() {
    this.resetModal(); // Reiniciar el modal después de guardar
    this.isVisibleHeadquarter = false;
  }
}
