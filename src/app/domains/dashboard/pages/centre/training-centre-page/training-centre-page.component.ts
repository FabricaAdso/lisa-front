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
import { TrainingCentreFormComponent } from '../components/training-centre-form/training-centre-form.component';
import { log } from 'ng-zorro-antd/core/logger';
import { NzMessageService } from 'ng-zorro-antd/message';
import { tableComponteModel, tableDataComponteModel } from '@shared/models/table.model';
import { ThisReceiver } from '@angular/compiler';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { RegionalService } from '@shared/services/regional.service';
import { RegionalModel } from '@shared/models/regional.model';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

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
    NzInputModule,
    NzPopconfirmModule,
    TrainingCentreFormComponent,
    NzSelectModule,
    NzPaginationModule
  ],
  templateUrl: './training-centre-page.component.html',
  styleUrl: './training-centre-page.component.css'
})
export class TrainingCentrePageComponent {

  private trainingCentreService = inject(TrainingCentreService);
  private nzMessageService = inject(NzMessageService);
  private regionalService = inject(RegionalService);

  centres : TrainingCentreModel[] = [];
  Datetable:tableComponteModel  = {} as tableComponteModel;
  centreUpdate:TrainingCentreModel | undefined;
  isModalVisible = false;

  regions: RegionalModel[] = [];


   // Paginación
   elements: number = 10;
   page: number = 1;
   last_page: number = 0;
   total_elements: number = 0;
   page_options: number[] = [];
 

   ngOnInit(): void {
    this.regionalService.getAllRegional().subscribe({
      next: (regions) => {
        this.regions = regions;
        this.loadCentres(); // Llamamos a la función con la paginación
      },
      error: (error) => {
        this.nzMessageService.error("Error al cargar las regiones: " + error);
      }
    });
  }

  changePage(pageIndex: number) {
    this.page = pageIndex;
    this.loadCentres(); 
  }

  loadCentres() {
    this.trainingCentreService.getCentrosPag({ 
      page: this.page, 
      per_page: this.elements 
    }).subscribe({
      next: (response) => {
       
        // Asumiendo que la API devuelve un objeto con `data`, `total` y `last_page`
        this.centres = response.data.map(centre => ({
          ...centre,
          regional: this.regions.find(r => r.id === centre.regional_id) || { id: 0, name: "Sin región" }
        }));
    
        // Actualizar valores de paginación con la respuesta de la API
        this.total_elements = response.total;
        
        this.last_page = response.last_page;
      
        this.page_options = Array.from({ length: this.last_page }, (_, i) => i + 1);
    
        this.updateTable();
      },
      error: error => this.nzMessageService.error(error)
    });
  }


  updateTable() {
    this.Datetable = this.mapToTable(this.centres);
  }

  nextPage() {
    if (this.page < this.last_page) {
      this.page++;
      this.loadCentres();
    }
  }
  
  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.last_page) {
      this.page = pageNumber;
      this.loadCentres();
    }
  }








  mapToTable(centres:TrainingCentreModel[]):tableComponteModel{
    return{
      Titles:["Código","Nombre", "Región", "Acciones"],
      Datos:centres.map((centre:TrainingCentreModel)=>this.mapToTableDatos(centre)) 
    }
  }
  mapToTableDatos(centres:TrainingCentreModel):tableDataComponteModel{
    return{
      Datos:[
        // centres.id.toString(),
        centres.code || "N/A",
        centres.name, 
        
        centres.regional?.name || "Sin región"
      ],
      idItem:centres.id,
      
      acciones:true,
    };
  }





  actualizarTabla(centro: TrainingCentreModel) {
    const index = this.centres.findIndex(c => c.id === centro.id);
    
    // Buscar la región correspondiente antes de actualizar la tabla
    const regionEncontrada = this.regions.find(r => r.id === centro.regional_id);
    
    // Agregar la región al objeto antes de actualizarlo en la lista
    centro.regional = regionEncontrada ? { ...regionEncontrada } : { id: 0, name: "Sin región" };

    if (index !== -1) {
        // Actualiza el elemento existente
        this.centres[index] = centro;
        this.Datetable.Datos[index] = this.mapToTableDatos(centro);
    } else {
        // Agrega un nuevo elemento si es una creación
        this.centres = [...this.centres, centro];
        this.Datetable.Datos = [...this.Datetable.Datos, this.mapToTableDatos(centro)];
    }
    
    // Cierra el modal y limpia la referencia de `centreUpdate`
    this.closeModal();
}

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }
  confirm(): void {
    
 
    
  }
  update(idItemTable?: number) {
    const item = this.centres.find((centre: TrainingCentreModel) => centre.id === idItemTable);
    if (item) {
      this.centreUpdate = { ...item }; // Clonar para evitar modificar el original antes de guardar
      this.isModalVisible = true;
    }
  }

  deleteCentre(idCentre: number) {  
    //console.log('Eliminar centro con ID:', idCentre); 

    const deleteSub = this.trainingCentreService.delete(idCentre).subscribe(() => {
      this.centres = this.centres.filter((centre: TrainingCentreModel) => centre.id !== idCentre)
      this.Datetable.Datos = this.Datetable.Datos.filter((centre:tableDataComponteModel ) => centre.idItem !== idCentre)
      this.nzMessageService.success('Registro Eliminado Correctamente');
      deleteSub.unsubscribe();
    });
  }

  openModal(item?:tableDataComponteModel){
    this.centreUpdate = undefined
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.centreUpdate = undefined; // Limpia el objeto en edición al cerrar el modal
  }




}
