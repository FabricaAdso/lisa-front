import { CommonModule } from '@angular/common';
import { Component, inject, NgModule, OnInit, ViewChild } from '@angular/core';
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
import { CreateHeadquartersDTO } from '@shared/dto/create-headquartersDTO';
import { ModalHeadquarterComponent } from "./modal-headquarter/modal-headquarter.component";
import { ModalEnvironmentComponent } from './modal-environment/modal-environment.component';
import { HeadquarterModel } from '@shared/models/headquarter.model';
import { UpdateHeadquartersDTO } from '@shared/dto/update-headquartersDTO';




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

  //funcion para abrir el modal de headquarter 
  openModalHeadquarter(): void {
    if (this.selectedHeadquarter) {
      const selected = this.headquartersList.find(h => h.id === this.selectedHeadquarter);
      if (selected) {
        this.modalHeadquarter.setData(selected); // Pasa el objeto seleccionado al hijo
        this.modalHeadquarter.isVisibleHeadquarter = false; // Muestra el modal
      }
    } else {
      console.warn('No se ha seleccionado una sede');
    }
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

   //funcion para editar sede desde el servicio 
   editHeadquarter(data:UpdateHeadquartersDTO): void {
    this.headquarterService.update(data).subscribe({
      next:(response)=>{
        console.log('Edit bien',response);
        this.getHeadquarters();

      }
    })
  }
  //funcion para cerea una sede desde el servicio

  createHeadquarter(data: CreateHeadquartersDTO) {
    this.headquarterService.create(data).subscribe({
      next: (response) => {
        console.log('Creado bien', response);
        this.getHeadquarters();

      }
    })
  }

  //funcion para eliminar unas sede desde el servicio

  deleteHeadquarter(id: number): void {
    this.headquarterService.delete(id).subscribe({
      next: () => {
        console.log('Sede eliminada correctamente');
        this.getHeadquarters(); // Actualiza la lista de sedes
      },
      error: (error) => {
        console.error('Error al eliminar la sede:', error);
      }
    });
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
  //funcion para mostrar los ambientes desde el servicio

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







