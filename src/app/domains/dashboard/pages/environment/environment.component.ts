import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAreaDTO } from '@shared/dto/create-areaDTO';
import { CreateEvironentDTO } from '@shared/dto/create-environmentDTO';
import { AreaModel } from '@shared/models/area-model';
import { EnvironmentModel } from '@shared/models/environment-model';
import { SedeModel } from '@shared/models/Sedemodel';
import { AreaService } from '@shared/services/area.service';
import { EnvironmentService } from '@shared/services/environment.service';
import { HeadquartersService } from '@shared/services/headquarters.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-environment',
  standalone: true,
  imports: [

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NzTableModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
  ],
  templateUrl: './environment.component.html',
  styleUrl: './environment.component.css'
})
export class EnvironmentComponent {

  private formBuilder = inject(FormBuilder);
  private environmentService = inject(EnvironmentService);
  private areaService = inject(AreaService);
  private headquarterService = inject(HeadquartersService);


  environments: EnvironmentModel[] = [];
  areas: AreaModel[] = [];
  headquarters: SedeModel[] = [];

  formEnvironments!: FormGroup | null;
  isModalVisible = false;
  editingEnvironment: number | null = null;

  nameFilter = ''; // Variable para almacenar el valor del filtro de nombre
  filteredEnvironments: EnvironmentModel[] = []; // Arreglo para datos filtrados

  ngOnInit(): void {
    this.loadData();// Carga los datos iniciales.
    this.createForm();
  }

  loadData() {
    const datasub = forkJoin([
      this.environmentService.get(),
      this.areaService.get(),
      this.headquarterService.getHeadquartes(),


    ]).subscribe({
      next: ([enviroments, areas, headquarters]) => {
        this.environments = [...enviroments]
        this.filteredEnvironments = [...this.environments]; 
        this.areas = [...areas]
        this.headquarters = [...headquarters]



        console.log(enviroments)
        console.log('Sedes:', this.headquarters);
        console.log('Áreas:', this.areas);

      },
      complete: () => {
        datasub.unsubscribe();
      }
    });
  }

  applyFilter() {
    const filterValue = this.nameFilter.trim().toLowerCase();
    this.filteredEnvironments = this.environments.filter(environment =>
      environment.name.toLowerCase().includes(filterValue)
    );
  }
  trackById(index: number, item: EnvironmentModel): number {
    return item.id;
  }

  createForm() {
    this.formEnvironments = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      capacity: new FormControl(null, [Validators.required]),
      headquarters_id: new FormControl(null, [Validators.required]),
      environment_area_id: new FormControl(null, [Validators.required]),

    });
  }

  // Cargar las sedes existentes
  loadEnvironments() {
    this.environmentService.get().subscribe(data => {
      this.environments = data;
    });
  }
  deleteHeadquarters(id: number) { //para el boton
    const deleteSub = this.environmentService.delete(id).subscribe(() => {
      this.loadEnvironments(); // Recarga la lista de sedes.
      deleteSub.unsubscribe(); // Desuscribe del observable.
    });
  }

  openModal(enviroment?: EnvironmentModel): void {
    this.isModalVisible = true;

    if (!this.formEnvironments) {
      this.createForm();
    }

    if (enviroment) {
      this.editingEnvironment = enviroment.id;
      this.formEnvironments?.patchValue({
        ...enviroment,

      });

    } else {
      this.editingEnvironment = null;
      this.formEnvironments?.reset();
    }
  }
  closeModal(): void {
    this.isModalVisible = false;
    this.formEnvironments?.reset();
    this.editingEnvironment = null;
  }

  saveData(): void {
    if (this.formEnvironments?.valid) {
      if (this.editingEnvironment) {
        const updatedEnvironment: EnvironmentModel = {
          id: this.editingEnvironment,
          ...this.formEnvironments.value
        };


        this.environmentService.update(updatedEnvironment).subscribe(() => {
          this.loadEnvironments();
          this.closeModal();
        });
      } else {
        // Si estamos creando un nuevo area
        const newEnvironment:CreateEvironentDTO = this.formEnvironments.value;
        this.environmentService.create(newEnvironment).subscribe(() => {
          this.loadEnvironments();  // Recargar la lista de sedes
          this.closeModal();        // Cerrar el modal
        });
      }
    } else {
      alert('Formulario incompleto o con errores.');
    }
  }



}
