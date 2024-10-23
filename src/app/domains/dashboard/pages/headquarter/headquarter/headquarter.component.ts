import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateHeadquartersDTO } from '@domains/dashboard/shared/dto/create-headquartersDTO';
import { UpdateHeadquartersDTO } from '@domains/dashboard/shared/dto/update-headquartersDTO';
import { HeadquartersModel } from '@domains/dashboard/shared/models/headquarters-model';
import { TrainingCentreModel } from '@domains/dashboard/shared/models/training-centre-model';
import { HeadquartersService } from '@domains/dashboard/shared/services/headquarters.service';
import { LocationService } from '@domains/dashboard/shared/services/location.service';
import { TrainingCentreService } from '@domains/dashboard/shared/services/training-centre.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

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
    NzSelectModule
  ],
  templateUrl: './headquarter.component.html',
  styleUrl: './headquarter.component.css'
})
export class HeadquarterComponent {

  private fb = inject(FormBuilder);
  private headquarterService = inject(HeadquartersService);
  private locationService = inject(LocationService);
  private trainingCentreService = inject(TrainingCentreService); 


  headquarters: HeadquartersModel[] = [];
  departments: string[] = [];   
  municipalities: string[] = []; 
  trainingCentres: TrainingCentreModel[] = []; 


  formHeadquarters!: FormGroup | null;
  isModalVisible = false;
  editingHeadquartersId: number | null = null;



  ngOnInit(): void {
    this.loadData();
    this.createForm();
  }

  
  loadData() {
    const datasub = forkJoin([
      this.trainingCentreService.getCentros(),
      this.locationService.getDepartments()
    ]).subscribe({
      next: ([trainingCentres, departments]) => {
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
      municipality: ['', Validators.required],
      address: ['', Validators.required],
      trainingCentreId: ['', Validators.required],
      openingHour: ['', Validators.required],
      closingHour: ['', Validators.required],
    });

    // Escuchar cambios en el campo de departamento para cargar los municipios
    this.formHeadquarters?.get('department')?.valueChanges.subscribe(departmentId => {
      this.onDepartmentChange(departmentId);
    });
  }

  // Actualizar formulario con datos existentes
  updateForm(headquarter: HeadquartersModel) {
    this.formHeadquarters?.patchValue({
      id: headquarter.id,
      name: headquarter.name,
      department: headquarter.department,
      municipality: headquarter.municipality,
      address: headquarter.address,
      trainingCentreId: headquarter.trainingCentre_Id,
      openingHour: headquarter.openingHour,
      closingHour: headquarter.closingHour
    });
  }

  // Guardar los datos (creación o edición)
  saveForm() {
    if (!this.formHeadquarters || this.formHeadquarters.invalid) {
      alert("Formulario incompleto");
      return;
    }

    const formValues = this.formHeadquarters.value;

    if (this.editingHeadquartersId) {
      const updatedHeadquarter: UpdateHeadquartersDTO = { id: this.editingHeadquartersId, ...formValues };
      const saveSub = this.headquarterService.update(updatedHeadquarter).subscribe(() => {
        this.loadHeadquarters();
        this.resetForm();
        saveSub.unsubscribe();
      });
    } else {
      const newHeadquarter: CreateHeadquartersDTO = formValues;
      const saveSub = this.headquarterService.create(newHeadquarter).subscribe(() => {
        this.loadHeadquarters();
        this.resetForm();
        saveSub.unsubscribe();
      });
    }
  }

  // Resetear el formulario
  resetForm() {
    this.formHeadquarters?.reset();
    this.editingHeadquartersId = null;
  }

  // Cargar las sedes existentes
  loadHeadquarters() {
    this.headquarterService.getHeadquartes().subscribe(data => {
      this.headquarters = data;
    });
  }

  // Eliminar una sede
  deleteHeadquarters(id: number) {
    const deleteSub = this.headquarterService.delete(id).subscribe(() => {
      this.loadHeadquarters();
      deleteSub.unsubscribe();
    });
  }


  openModal(headquarter?: HeadquartersModel): void {
    this.isModalVisible = true;
  
    if (!this.formHeadquarters) {
      this.createForm();
    }
    
    if (headquarter) {
      this.editingHeadquartersId = headquarter.id;
      this.formHeadquarters?.patchValue(headquarter); 
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
      // Si estamos editando un headquarter existente
      if (this.editingHeadquartersId) {
        const updatedHeadquarter: UpdateHeadquartersDTO = {
          id: this.editingHeadquartersId,
          ...this.formHeadquarters.value
        };
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
