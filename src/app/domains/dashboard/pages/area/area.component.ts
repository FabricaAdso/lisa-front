import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAreaDTO } from '@shared/dto/create-areaDTO';
import { UpdateAreaDto } from '@shared/dto/update-areaDTO';
import { AreaModel } from '@shared/models/area-model';
import { AreaService } from '@shared/services/area.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-area',
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
    NzPopconfirmModule
  ],
  templateUrl: './area.component.html',
  styleUrl: './area.component.css'
})
export class AreaComponent {


  private formBuilder = inject(FormBuilder);
  private areaService = inject(AreaService);
  private nzMessageService = inject(NzMessageService);


  areas: AreaModel[] = [];
  isModalVisible = false;

  formAreas: FormGroup | null = null;
  indexArea: number | null = null;

  ngOnInit() {
    this.getAreas();
    this.inicializeForm();

  }
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }
  confirm(id: number): void {
    this.deleteArea(id); 
    this.nzMessageService.info('Confirmación de eliminación');
  }

  deleteArea(id: number) {
    const deleteSub = this.areaService.delete(id).subscribe(() => {
      this.getAreas(); // Recarga la lista de sedes.
      deleteSub.unsubscribe(); // Desuscribe del observable.
    });
  }




  inicializeForm(): void {
    this.formAreas = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]]
    });
  }
  getAreas(): void {
    this.areaService.get().subscribe({
      next: (data: AreaModel[]) => {
        this.areas = data;

      }
    });
  }
  openModal(area?: AreaModel): void {
    this.isModalVisible = true;

    if (!this.formAreas) {
      this.inicializeForm();
    }
    if (area) {
      this.indexArea = area.id;
      this.formAreas?.patchValue({
        name: area.name
      });

    } else {
      this.indexArea = null;
      this.formAreas?.reset();

    }

  }
  closeModal(): void {
    this.isModalVisible = false;

  }

  saveData(): void {

    if (this.formAreas?.valid) {
      if (this.indexArea !== null) {
        // Editamos el centro existente
        const updatedCentre: UpdateAreaDto = {
          id: this.indexArea,
          ...this.formAreas.value
        };
        this.areaService.update(updatedCentre).subscribe(() => {
          this.getAreas(); // Actualizamos la lista
          this.resetForm();
        });
      } else {
        // Creamos una nueva area
        const newArea: CreateAreaDTO = this.formAreas?.value;
        this.areaService.create(newArea).subscribe(() => {
          this.getAreas(); // Actualizamos la lista
          this.resetForm();
        });
      }
    }



  }

  // Método para resetear el formulario y cerrar el modal
  resetForm(): void {
    this.formAreas?.reset();
    this.indexArea = null;
    this.isModalVisible = false;

  }

}
