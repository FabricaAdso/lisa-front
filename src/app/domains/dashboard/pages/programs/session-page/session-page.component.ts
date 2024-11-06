import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { AddProgramModalComponent } from '../modals/add-program-modal/add-program-modal.component';
import { BulkUploadModalComponent } from '../modals/bulk-upload-modal/bulk-upload-modal.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SessionModel } from '@shared/models/session.model';
import { SessionService } from '@shared/services/program/session.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { NzMessageService } from 'ng-zorro-antd/message';
import { tableComponteModel, tableDataComponteModel } from '@shared/models/table.model';

@Component({
  selector: 'app-session-page',
  standalone: true,
  imports: [CommonModule, NzInputModule,NgIconComponent,NzIconModule,NzTableModule,NzDividerModule,NzButtonModule, NzFlexModule, NzPopconfirmModule,NzUploadModule, AddProgramModalComponent, BulkUploadModalComponent,NzSpaceModule,NzPaginationModule],
  templateUrl: './session-page.component.html',
  styleUrl: './session-page.component.css'
})
export class SessionPageComponent implements OnInit{
  
  private sessionService = inject(SessionService);
  private nzMessageService = inject(NzMessageService);

  sessions : SessionModel[] = [];
  Datetable:tableComponteModel  = {} as tableComponteModel;
  centreUpdate:SessionModel | undefined;
  isModalVisible = false;


  ngOnInit(): void {
    this.sessionService.getSession().subscribe({
      next: (sessions) => {
        this.sessions = sessions
          this.Datetable = this.mapToTable(sessions)

      },
      error:error =>{
        this.nzMessageService.error(error);
      }
    })
  }
  mapToTable(sessions:SessionModel[]):tableComponteModel{
    return{
      Titles:["ID","Nombre","Acciones"],
      Datos:sessions.map((centre:SessionModel)=>this.mapToTableDatos(centre)) 
    }
  }
  mapToTableDatos(centres:SessionModel):tableDataComponteModel{
    return{
      Datos:[centres.id.toString(),centres.name],
      idItem:centres.id,
      acciones:true,
    }
  }

  actualizarTabla(session: SessionModel) {
    const index = this.sessions.findIndex(c => c.id === session.id);
    
    if (index !== -1) {
      // Actualiza el elemento existente
      this.sessions[index] = session;
      this.Datetable.Datos[index] = this.mapToTableDatos(session);
    } else {
      // Agrega un nuevo elemento si es una creación
      this.sessions = [...this.sessions, session];
      this.Datetable.Datos = [...this.Datetable.Datos, this.mapToTableDatos(session)];
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
    const item = this.sessions.find((session:SessionModel)=>session.id == idItemTable)
    if(item){
      this.sessionUpdate = item
      this.isModalVisible = true;
    }
  }

  deleteCentre(idCentre: number) {  
    //console.log('Eliminar centro con ID:', idCentre); 

    const deleteSub = this.sessionService.delete(idSession).subscribe(() => {
      this.sessions = this.sessions.filter((session: SessionModel) => session.id !== idSession)
      this.Datetable.Datos = this.Datetable.Datos.filter((session:tableDataComponteModel ) => session.idItem !== idSession)
      deleteSub.unsubscribe();
    });
  }

  openModal(item?:tableDataComponteModel){
    this.sessionUpdate = undefined
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.sessionUpdate = undefined; // Limpia el objeto en edición al cerrar el modal
  }


}

