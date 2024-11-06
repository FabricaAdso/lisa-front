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
    TrainingCentreFormComponent
  ],
  templateUrl: './training-centre-page.component.html',
  styleUrl: './training-centre-page.component.css'
})
export class TrainingCentrePageComponent {

  private trainingCentreService = inject(TrainingCentreService);
  private nzMessageService = inject(NzMessageService);

  centres : TrainingCentreModel[] = [];
  Datetable:tableComponteModel  = {} as tableComponteModel;
  centreUpdate:TrainingCentreModel | undefined;
  isModalVisible = false;


  ngOnInit(): void {
    this.trainingCentreService.getCentros().subscribe({
      next: (centres) => {
        this.centres = centres
          this.Datetable = this.mapToTable(centres)

      },
      error:error =>{
        this.nzMessageService.error(error);
      }
    })
  }
  mapToTable(centres:TrainingCentreModel[]):tableComponteModel{
    return{
      Titles:["ID","Nombre","Acciones"],
      Datos:centres.map((centre:TrainingCentreModel)=>this.mapToTableDatos(centre)) 
    }
  }
  mapToTableDatos(centres:TrainingCentreModel):tableDataComponteModel{
    return{
      Datos:[centres.id.toString(),centres.name],
      idItem:centres.id,
      acciones:true,
    }
  }

  actualizarTabla(centro: TrainingCentreModel) {
    const index = this.centres.findIndex(c => c.id === centro.id);
    
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
    this.nzMessageService.info('Eliminado Correctamente');
 
    
  }
  update(idItemTable?:number){
    const item = this.centres.find((centre:TrainingCentreModel)=>centre.id == idItemTable)
    if(item){
      this.centreUpdate = item
      this.isModalVisible = true;
    }
  }

  deleteCentre(idCentre: number) {  
    //console.log('Eliminar centro con ID:', idCentre); 

    const deleteSub = this.trainingCentreService.delete(idCentre).subscribe(() => {
      this.centres = this.centres.filter((centre: TrainingCentreModel) => centre.id !== idCentre)
      this.Datetable.Datos = this.Datetable.Datos.filter((centre:tableDataComponteModel ) => centre.idItem !== idCentre)
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
