import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
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
import { NzModalContentDirective, NzModalModule } from 'ng-zorro-antd/modal';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

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
    NzModalModule,
    NzModalContentDirective,
    FormsModule,
    NzTimePickerModule
  ],
  templateUrl: './modal-headquarter.component.html',
  styleUrl: './modal-headquarter.component.css',
})
export class ModalHeadquarterComponent {

  //Declaracion de variables

  trainingCentersList: TrainingCenterModel[] = [];
  formHeadquarter!: FormGroup;
  isVisibleHeadquarter = false;
  isEdit = false;
  defaultOpenValue = new Date(0, 0, 0, 0, 0);
  private date_pipe = inject(DatePipe)
  titleHeadquarter = '';

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
    this.changeTitle()

    const formData = {...data}

      
      const [hours, minutes] = formData.opening_time.split(':').map(Number);
      const [hours2, minutes2] = formData.closing_time.split(':').map(Number);

      const startTime = new Date()
      const endTime = new Date()

      startTime.setHours(hours, minutes, 0, 0);
      endTime.setHours(hours2, minutes2, 0, 0);


    this.formHeadquarter.patchValue({
      name: data.name,
      adress: data.adress,
      opening_time: startTime,
      closing_time: endTime,
      municipality: data.municipality,
      id: data.id,
      training_center_id: data.training_center_id,
    });
    // Deshabilitar el campo training_center_id en modo edición
    this.formHeadquarter.get('training_center_id')?.disable();
   
  }

  changeTitle() {
    if (!this.isEdit) {
      return this.titleHeadquarter = 'Crear Sede';
    } else {
      return this.titleHeadquarter = 'Editar Sede';
    }
  }


  //funcion pra guardar los datos, dependeindo si esta editando o creando una sede

    saveHeadquarter(): void {

    const data = this.formHeadquarter.value;

    // convertir start_time a "HH:mm"
    if (data.opening_time) {
      const startTime = new Date(data.opening_time);
      const formattedStartTime = this.date_pipe.transform(startTime, 'HH:mm')?.trim();
      if (!formattedStartTime) {
        this.notification.create('error', 'Error', 'Hora de inicio inválida');
        return;
      }
      data.opening_time = formattedStartTime;
    }
    if (data.closing_time) {
      const endTime = new Date(data.closing_time);
      const formattedEndTime = this.date_pipe.transform(endTime, 'HH:mm')?.trim();
      if (!formattedEndTime) {
        this.notification.create('error', 'Error', 'Hora de fin inválida');
        return;
      }
      data.closing_time = formattedEndTime;
    }
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

  //Metodo para abrir el modal 
  openModal() {
    this.isVisibleHeadquarter = true;
    this.changeTitle()
  }


  //funcion pra cerrar el modal

  closeModal() {
    this.resetModal(); // Reiniciar el modal después de guardar
    this.isVisibleHeadquarter = false;
  }
}
