import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CreateCentreDTO } from '@shared/dto/create-centreDTO';
import { UpdateCentreDTO } from '@shared/dto/update-centreDTO';
import { TrainingCentreModel } from '@shared/models/training-centre-model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import {NzFormModule} from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { TrainingCentreService } from '@shared/services/training-centre.service';

@Component({
  selector: 'app-training-centre-page',
  standalone: true,
  imports: [
   
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NzTableModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule
  ],
  templateUrl: './training-centre-page.component.html',
  styleUrl: './training-centre-page.component.css'
})
export class TrainingCentrePageComponent {

  // Inyectamos las dependencias directamente
  private formBuilder = inject(FormBuilder);
  private trainingCentreService = inject(TrainingCentreService);

  centres: TrainingCentreModel[] = [];
  isModalVisible = false;

  formCentres: FormGroup | null = null;
  indexCentre: number | null = null;

  
 

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.getData();
    this.initializeForm();
  }

  // Inicializamos el formulario reactivo
  initializeForm(): void {
    this.formCentres = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  // Obtenemos los datos de los centros de formación
  getData(): void {
    // Llamamos al servicio para obtener los centros de formación
    this.trainingCentreService.getCentros().subscribe({
      next: (data: TrainingCentreModel[]) => {
        this.centres = data; // Asignamos los datos recibidos a la variable centres
        console.log('Centros de formación cargados:', this.centres); // Log para verificar los datos
      },
      error: (err) => {
        console.error('Error al cargar los centros de formación:', err); // Manejo de errores
      }
    });
  }

  // Abrimos el formulario para crear o editar
  
  openModal(centre?: TrainingCentreModel): void {
    this.isModalVisible = true;
    
    // Si el formulario aún no está inicializado, lo inicializamos
    if (!this.formCentres) {
      this.initializeForm();
    }
  
    // Si estamos editando un centro, cargamos los datos en el formulario
    if (centre) {
      this.indexCentre = centre.id; // Guardamos el índice del centro que se está editando
      this.formCentres?.patchValue({
        name: centre.name
      });
    } else {
      this.indexCentre = null;
      this.formCentres?.reset();
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
  }



  // Guardamos los datos, ya sea creación o edición
  saveData(): void {
    if (this.formCentres?.valid) {
      if (this.indexCentre !== null) {
        // Editamos el centro existente
        const updatedCentre: UpdateCentreDTO = {
          id: this.indexCentre,
          ...this.formCentres.value
        };
        this.trainingCentreService.update(updatedCentre).subscribe(() => {
          this.getData(); // Actualizamos la lista
          this.resetForm();
        });
      } else {
        // Creamos un nuevo centro
        const newCentre: CreateCentreDTO = this.formCentres?.value;
        this.trainingCentreService.create(newCentre).subscribe(() => {
          this.getData(); // Actualizamos la lista
          this.resetForm();
        });
      }
    }
  }

  // Método para eliminar un centro
  deleteCentre(id: number): void {
    if (confirm('¿Desea eliminar este centro? ')) {
      this.trainingCentreService.delete(id).subscribe(() => {
        this.getData(); // Actualizamos la lista
      });
    }
  }

  // Método para resetear el formulario y cerrar el modal
  resetForm(): void {
    this.formCentres?.reset();
    this.indexCentre = null;
    this.isModalVisible = false;
    
  }


}
