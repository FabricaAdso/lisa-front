import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateHeadquartersDTO } from '@shared/dto/create-headquartersDTO';
import { UpdateHeadquartersDTO } from '@shared/dto/update-headquartersDTO';
import { despartamentosModel } from '@shared/models/Departamentos.model';
import { municipiosModel } from '@shared/models/municipios.model';
import { SedeModel } from '@shared/models/Sedemodel';
import { TrainingCentreModel } from '@shared/models/training-centre-model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { log } from 'ng-zorro-antd/core/logger';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';
import { HeadcuarterFormComponent } from '../components/headcuarter-form/headcuarter-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';


import { HeadquartersService } from '@shared/services/headquarters.service';
import { LocationService } from '@shared/services/location.service';
import { TrainingCentreService } from '@shared/services/training-centre.service';


@Component({
  selector: 'app-headquarter',
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
    NzPopconfirmModule,

    HeadcuarterFormComponent
  ],
  templateUrl: './headquarter.component.html',
  styleUrl: './headquarter.component.css'
})
export class HeadquarterComponent {

  private fb = inject(FormBuilder);
  private headquarterService = inject(HeadquartersService);
  private locationService = inject(LocationService);
  private trainingCentreService = inject(TrainingCentreService);
  private nzMessageService = inject(NzMessageService);

  // Variables para almacenar datos.
  headquarters: SedeModel[] = [];
  departments: despartamentosModel[] = [];
  municipalities: municipiosModel[] = [];
  trainingCentres: TrainingCentreModel[] = [];


  formHeadquarters!: FormGroup | null;
  isModalVisible = false;
  editingHeadquartersId: number | null = null;  // ID de la sede en edición.



  ngOnInit(): void {
    this.loadData();// Carga los datos iniciales.
    this.createForm();
  }
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }
  confirm(id: number): void {
    this.deleteHeadquarters(id); // Llama a deleteHeadquarters con el id
    this.nzMessageService.info('Confirmación de eliminación');
  }
  
  deleteHeadquarters(id: number) {
    const deleteSub = this.headquarterService.delete(id).subscribe(() => {
      this.loadHeadquarters(); // Recarga la lista de sedes.
      deleteSub.unsubscribe(); // Desuscribe del observable.
    });
  }



  loadData() {
    const datasub = forkJoin([
      this.headquarterService.getHeadquartes(),
      this.trainingCentreService.getCentros(),
      this.locationService.getDepartments()
    ]).subscribe({
      next: ([headquarters, trainingCentres, departments]) => {
        this.headquarters = [...headquarters];
        console.log(headquarters)
        this.trainingCentres = [...trainingCentres];
        this.departments = [...departments];
      },
      complete: () => {
        datasub.unsubscribe();
      }
    });
  }

  // Cargar los municipios cuando se selecciona un departamento
  onDepartmentChange(departmentId: number) {
    // Reinicia el campo de municipio en el formulario
    this.formHeadquarters?.get('municipality_id')?.setValue(null);
    this.municipalities = []; // Limpia la lista de municipios
    if (departmentId) {
      this.locationService.getMunicipalities(departmentId).subscribe(municipalities => {
        this.municipalities = [...municipalities];
      });
    }
  }

  // Crear el formulario
  createForm() {
    this.formHeadquarters = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      department: ['', Validators.required],
      municipality_id: ['', Validators.required],
      adress: ['', Validators.required],
      training_center_id: ['', Validators.required],
      opening_time: ['', Validators.required],
      closing_time: ['', Validators.required],
    });

    // Escuchar cambios en el campo de departamento para cargar los municipios
    this.formHeadquarters?.get('department')?.valueChanges.subscribe(departmentId => {
      this.onDepartmentChange(departmentId);
    });
  }

  get fieldDepartment() {
    return this.formHeadquarters!.get('department') as FormControl;
  }


  formatHora(hora: string): string {
    const [hours, minutes] = hora.split(':');
    const formattedClosingHour = `${hours}:${minutes}`;

    return formattedClosingHour
  }



  // Cargar las sedes existentes
  loadHeadquarters() {
    this.headquarterService.getHeadquartes().subscribe(data => {
      this.headquarters = data;
    });
  }



  openModal(headquarter?: SedeModel): void {
    this.isModalVisible = true;

    if (!this.formHeadquarters) {
      this.createForm();
    }

    if (headquarter) {
      this.editingHeadquartersId = headquarter.id;
      this.formHeadquarters?.patchValue({
        ...headquarter,
        department: headquarter.municipality.departament_id, // Asegúrate de que este campo sea el ID correcto del departamento
        municipality_id: headquarter.municipality.id
      });
      // Cargar municipios según el departamento actual
      this.onDepartmentChange(headquarter.municipality.departament_id);
    } else {
      this.editingHeadquartersId = null;
      this.formHeadquarters?.reset();
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.formHeadquarters?.reset(); // Opcional: resetea el formulario al cerrar el modal
    this.editingHeadquartersId = null; // Limpia el id de edición
  }
  saveData(): void {
    if (this.formHeadquarters?.valid) {
      if (this.editingHeadquartersId) {
        const updatedHeadquarter: SedeModel = {
          id: this.editingHeadquartersId, // Incluye el ID de la sede en la actualización.
          ...this.formHeadquarters.value
        };

        // Formatea las horas.
        updatedHeadquarter.closing_time = this.formatHora(updatedHeadquarter.closing_time)
        updatedHeadquarter.opening_time = this.formatHora(updatedHeadquarter.opening_time)
        this.headquarterService.update(updatedHeadquarter).subscribe(() => {
          this.loadHeadquarters();  // Recargar la lista de sedes
          this.closeModal();        // Cerrar el modal
        });
      } else {
        // Si estamos creando un nuevo headquarter
        const newHeadquarter: CreateHeadquartersDTO = this.formHeadquarters.value;
        this.headquarterService.create(newHeadquarter).subscribe(() => {
          this.loadHeadquarters();  // Recargar la lista de sedes
          this.closeModal();        // Cerrar el modal
        });
      }
    } else {
      alert('Formulario incompleto o con errores.');
    }
  }







}
