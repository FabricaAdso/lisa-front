import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { ModalHeadquarterComponent } from "./modal-headquarter/modal-headquarter.component";
import { ModalEnvironmentComponent } from './modal-environment/modal-environment.component';
import { HeadquarterModel } from '@shared/models/headquarter.model';
import { id } from 'date-fns/locale';





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
    ModalEnvironmentComponent
  ],
  templateUrl: './environment.component.html',
  styleUrl: './environment.component.css'

})


export class EnvironmentComponent implements OnInit {

  @ViewChild('modalEnviroment') modalEnviroment: any = ModalEnvironmentComponent
  @ViewChild('modalHeadquarter') modalHeadquarter: any = ModalHeadquarterComponent


  //injectamos los dos servicios

  private environmentService = inject(EnvironmentService);
  private headquarterService = inject(HeadquartersService);


  //Declaracion de varibales


  Environments: EnvironmentModel[] = [];
  filteredEnvironments: EnvironmentModel[] = [];
  headquartersList: HeadquarterModel[] = [];
  selectedHeadquarter: number | null = null;
  isLoading = false;


  //funcion para abrir el modal de environment
  openModalEnvironment() {
    this.modalEnviroment.isVisible = false;
  }


  //funcion para abrir el modal de sedes para editar la sede selecionada
  //  se le envia la informacion para que se visualice el formulario 
  openModalHeadquarter(): void {
    if (this.selectedHeadquarter !== null) {
      const selected = this.headquartersList.find(h => h.id === this.selectedHeadquarter);
      if (selected) {
        this.modalHeadquarter.setData(selected); // Aquí se envía el objeto completo
        this.modalHeadquarter.isVisibleHeadquarter = false; // Muestra el modal
      }
    } else {
      console.log('No se ha seleccionado una sede');
    }
  }


  openCreateModalHeadquarter() {
    this.modalHeadquarter.formHeadquarter.reset();
    this.selectedHeadquarter = null; // Limpia los datos
    this.modalHeadquarter.isVisibleHeadquarter = false;
    this.getEnvironments();
  }


  //funcion para mostrar las sedes desde el servicio

  getHeadquarters(): void {
    const data_sub = forkJoin([
      this.headquarterService.getHeadquarters()]).subscribe({
        next: ([data]) => {
          this.headquartersList = [...data];
          console.log(this.headquartersList);
        },
        complete() {
          data_sub.unsubscribe()
        }
      })
  }

  deleteHeadquarter(id:number):void{
    this.headquarterService.delete(id).subscribe({
      next: () => {
        this.getEnvironments();
        this.getHeadquarters();
      }
    })

  }

  //funcion para filtrar los ambientes dependiendo si perteneces a una sede

  filterEnvironmentsByHeadquarter(): void {
    if (this.selectedHeadquarter) {
      this.filteredEnvironments = this.Environments.filter(
        (environment) => environment.headquarters?.id === this.selectedHeadquarter
      );
    } else {
      this.filteredEnvironments = [];
    }
  }

  //funcion para selecionar una sede 

  onSelectHeadquarter(headquarterId: number): void {
    this.selectedHeadquarter = headquarterId;
    this.filterEnvironmentsByHeadquarter();
    
  }


  onDeleteHeadquarter(): void {
    if (this.selectedHeadquarter !== null) {
      this.deleteHeadquarter(this.selectedHeadquarter);
    } else {
      console.log('Debe seleccionar una sede para eliminar');
    }
  }


  //funcion para mostrar los ambientes desde el servicio, incluyendo el area y su sede 

  getEnvironments(): void {
    const query = {
      included: ['headquarters', 'knowledgeNetwork']
    };

    this.environmentService.getEnvironments(query).subscribe((environments) => {
      this.Environments = environments;
      this.filteredEnvironments = [];

    });
  }

  trackByHeadquarter(index: number, item: any): number {
    return item.id;
  }


  //iniciar el componente
  ngOnInit(): void {

    this.getEnvironments();
    this.getHeadquarters();
  }

}







