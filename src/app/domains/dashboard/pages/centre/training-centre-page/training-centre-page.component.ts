import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CreateCentreDTO } from '@domains/shared/dto/create-centreDTO copy';
import { UpdateCentreDTO } from '@domains/shared/dto/update-centreDTO';
import { TrainingCentreModel } from '@domains/shared/models/training-centre-model';
import { TrainingCentreService } from '@domains/shared/services/training-centre.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-training-centre-page',
  standalone: true,
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NzTableModule
  ],
  templateUrl: './training-centre-page.component.html',
  styleUrl: './training-centre-page.component.css'
})
export class TrainingCentrePageComponent {

  // Inyectamos las dependencias directamente
  private formBuilder = inject(FormBuilder);
  private trainingCentreService = inject(TrainingCentreService);

  isModalVisible = false;



  formCentres: FormGroup | null = null;
  indexCentre: number | null = null;

  centres: TrainingCentreModel[] = [];
 
  

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
    this.trainingCentreService.getCentros().subscribe((data: TrainingCentreModel[]) => {
      this.centres = data;
    });
  }

  // Abrimos el formulario para crear o editar
  openModal(centre?: TrainingCentreModel): void {
    this.isModalVisible = true;
    
    // Inicializar el formulario si aún no lo está
    if (!this.formCentres) {
      this.initializeForm();
    }
  
    if (centre) {
      this.formCentres?.patchValue({
        name: centre.name
      });
    } else {
      this.formCentres?.reset();
    }
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
    // Aquí cierras el modal
  }


}
