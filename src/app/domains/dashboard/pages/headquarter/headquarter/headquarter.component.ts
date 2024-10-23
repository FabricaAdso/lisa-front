import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateHeadquartersDTO } from '@domains/dashboard/shared/dto/create-headquartersDTO';
import { UpdateHeadquartersDTO } from '@domains/dashboard/shared/dto/update-headquartersDTO';
import { HeadquartersModel } from '@domains/dashboard/shared/models/headquarters-model';
import { HeadquartersService } from '@domains/dashboard/shared/services/headquarters.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';

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
    NzInputModule
  ],
  templateUrl: './headquarter.component.html',
  styleUrl: './headquarter.component.css'
})
export class HeadquarterComponent {

  private fb = inject(FormBuilder);
  private headquarterService = inject(HeadquartersService);

  headquarters: HeadquartersModel[] = [];
  formHeadquarters!: FormGroup | null;
  isModalVisible = false;
  editingHeadquartersId: number | null = null;

  ngOnInit(): void {

  }
  // Inicializamos el formulario
  initializeForm(): void {
    this.formHeadquarters = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      department: ['', Validators.required],
      municipality: ['', Validators.required],
      address: ['', Validators.required],
      trainingCentreId: ['', Validators.required],
      openingHour: ['', Validators.required],
      closingHour: ['', Validators.required],
    });
  }

  // Cargamos las sedes
  loadHeadquarters(): void {
    this.headquarterService.getHeadquartes().subscribe((data: HeadquartersModel[]) => {
      this.headquarters = data;
    });
  }

  // Abrir modal para crear o editar una sede
  openModal(headquarters?: HeadquartersModel): void {
    this.isModalVisible = true;

    if (!this.formHeadquarters) {
      this.initializeForm();
    }
    if (headquarters) {
      this.editingHeadquartersId = headquarters.id;
      this.formHeadquarters?.patchValue(headquarters);
    } else {
      this.editingHeadquartersId = null;
      this.formHeadquarters?.reset();
      
    }
  }
   // Cerrar modal
   closeModal(): void {
    this.isModalVisible = false;
    this.formHeadquarters?.reset();
    this.editingHeadquartersId = null;
  }

  // Guardar sede (creación o actualización)
  saveData(): void {
    if (this.formHeadquarters?.valid) {
      if (this.editingHeadquartersId) {
        const updatedHeadquarters: UpdateHeadquartersDTO = {
          id: this.editingHeadquartersId,
          ...this.formHeadquarters.value
        };
        this.headquarterService.update(updatedHeadquarters).subscribe(() => {
          this.loadHeadquarters();
          this.closeModal();
        });
      } else {
        const newHeadquarters: CreateHeadquartersDTO = this.formHeadquarters.value;
        this.headquarterService.create(newHeadquarters).subscribe(() => {
          this.loadHeadquarters();
          this.closeModal();
        });
      }
    }
  }

  // Eliminar sede
  deleteHeadquarters(id: number): void {
    if (confirm('Do you want to delete this headquarters? This action cannot be undone.')) {
      this.headquarterService.delete(id).subscribe(() => {
        this.loadHeadquarters();
      });
    }
  }

 



}
