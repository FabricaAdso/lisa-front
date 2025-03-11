import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnvironmentModel } from '@shared/models/environment-model';
import { EnvironmentService } from '@shared/services/environment.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { HeadquartersService } from '@shared/services/headquarters.service';
import { forkJoin } from 'rxjs';
import { ModalHeadquarterComponent } from './modal-headquarter/modal-headquarter.component';
import { ModalEnvironmentComponent } from './modal-environment/modal-environment.component';
import { HeadquarterModel } from '@shared/models/headquarter.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-environment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDividerModule,
    NzTableModule,
    FormsModule,
    NzSelectModule,
    NzSpinModule,
    NzTableModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ModalHeadquarterComponent,
    ModalEnvironmentComponent,
  ],
  templateUrl: './environment.component.html',
  styleUrl: './environment.component.css',
})
export class EnvironmentComponent {


  @ViewChild('modalEnviroment') modalEnviroment: any =
    ModalEnvironmentComponent;
  @ViewChild('modalHeadquarter') modalHeadquarter: any =
    ModalHeadquarterComponent;

  //injectamos los dos servicios

  private environmentService = inject(EnvironmentService);
  private headquarterService = inject(HeadquartersService);
  private message = inject(NzMessageService);

  //Declaracion de varibales

  EnvironmentsList: EnvironmentModel[] = [];
  selectedEnvironment:number | null = null;
  filteredEnvironments: EnvironmentModel[] = [];
  headquartersList: HeadquarterModel[] = [];
  selectedHeadquarter: number | null = null;

  //funcion para abrir el modal de environment
  openModalEnvironment(id:number):void {

    this.selectedEnvironment = id
    console.log('Selected Environment:', this.selectedEnvironment); // Depuración
    if(this.selectedEnvironment !== null ) {
      const selected = this.EnvironmentsList.find(
        (e) => e.id === this.selectedEnvironment,


      );
      if(selected){
        this.modalEnviroment.setData(selected);
        this.modalEnviroment.openModal();

      }
    }else{
      this.message.warning(
        'No se ha seleccionado un ambiente '
      )
    }

  }


  openCreateModalEnvironment(){
    this.modalEnviroment.openModal()



  }
  //funcion para abrir el modal de sedes, para editar la sede selecionada
  //  se le envia la informacion para que se visualice el formulario
  openModalHeadquarter(): void {
    console.log('sede depurada:', this.selectedHeadquarter); // Depuración
    if (this.selectedHeadquarter !== null) {
      const selected = this.headquartersList.find(
        (h) => h.id === this.selectedHeadquarter
      );
      if (selected) {
        this.modalHeadquarter.setData(selected); // Aquí se envía el objeto completo
        this.modalHeadquarter.isVisibleHeadquarter = false; // Muestra el modal
      }
    } else {
      this.message.warning(
        'No se ha seleccionado una sede, por favor selecciona una  '
      );
    }
  }

  //funcion pra abrie el modal pero para crear una sede

  openCreateModalHeadquarter() {
    this.getEnvironments();
    this.modalHeadquarter.formHeadquarter.reset();
    this.selectedHeadquarter = null; // Limpia los datos
    this.modalHeadquarter.isVisibleHeadquarter = false;
  }

  //funcion para mostrar las sedes desde el servicio

  getHeadquarters(): void {
    const data_sub = forkJoin([
      this.headquarterService.getHeadquarters(),
    ]).subscribe({
      next: ([data]) => {
        this.headquartersList = [...data];
      },
      complete() {
        data_sub.unsubscribe();
      },
    });
  }

  //funcion para eliminar una sede desde el servicio  con mensaje de confirmacion

  deleteHeadquarter(id: number): void {
    const confirmacion = window.confirm(
      '¿Estás seguro de eliminar esta sede? Esta acción no se puede deshacer.'
    );

    if (confirmacion) {
      this.headquarterService.delete(id).subscribe({
        next: () => {
          this.message.success('Sede eliminada correctamente'); // Mensaje de éxito
          this.selectedHeadquarter = null; //volver al valor determinado
          this.getHeadquarters(); // Actualizar la lista de sedes
          this.getEnvironments(); // Actualizar la lista de ambientes
        },
        error: () => {
          this.message.error('Error al eliminar la sede'); // Mensaje de error
        },
      });
    } else {
      this.message.error('Eliminación  de sede cancelada');
    }
  }

  //funcion para eliminar la sede seleccionda consumiendo
  //  la funcion que hace el llamado al servicio

  onDeleteHeadquarter(): void {
    if (this.selectedHeadquarter !== null) {
      this.deleteHeadquarter(this.selectedHeadquarter);
    } else {
      this.message.warning('Debe seleccionar una sede para eliminar ');
    }
  }

  //funcion para filtrar los ambientes dependiendo si perteneces a una sede

  filterEnvironmentsByHeadquarter(): void {
    if (this.selectedHeadquarter) {
      this.filteredEnvironments = this.EnvironmentsList.filter(
        (environment) =>
          environment.headquarters?.id === this.selectedHeadquarter
      );
    } else {
      this.filteredEnvironments = [];
    }
  }

  //funcion para selecionar una sede y aplicar el filtro de ambientes

  onSelectHeadquarter(id: number): void {
    this.selectedHeadquarter = id;
    this.filterEnvironmentsByHeadquarter();
  }

  //funcion para mostrar los ambientes desde el servicio, incluyendo el area y su sede

  getEnvironments(): void {
    const query = {
      included: ['headquarters', 'knowledgeNetwork'],
    };

    this.environmentService.getEnvironments(query).subscribe((environments) => {
      this.EnvironmentsList = environments;
      this.filteredEnvironments = [];
    });
  }


  //iniciar el componente
  ngOnInit(): void {
    this.getEnvironments();
    this.getHeadquarters();
  }
}
