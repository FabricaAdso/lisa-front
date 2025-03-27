import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EnvironmentModel } from '@shared/models/environment-model';
import { HeadquarterModel } from '@shared/models/headquarter.model';
import { KnowledgeNetworkByInstructorModel } from '@shared/models/knowledg-network.model';
import { EnvironmentService } from '@shared/services/environment.service';
import { HeadquartersService } from '@shared/services/headquarters.service';
import { KnowledgeNetworkService } from '@shared/services/knowledge-network.service';
import { he } from 'date-fns/locale';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-modal-environment',
  standalone: true,
  imports: [
    NzFormModule,
    CommonModule,
    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzSelectModule
  ],
  templateUrl: './modal-environment.component.html',
  styleUrl: './modal-environment.component.css',
})
export class ModalEnvironmentComponent {

  //eventos
  @Output() updateEnvironment: EventEmitter<void> = new EventEmitter;
  @Input() environmentData?: EnvironmentModel | null;

  //Declaracion de varibales
  isVisible = false;
  formEnvironment!: FormGroup;
  isEdit = false;
  headquarterList: HeadquarterModel[] = [];
  knowlwdegeList: KnowledgeNetworkByInstructorModel[] = [];

  //injeccion de servicios
  private environmentService = inject(EnvironmentService)
  private headquarterService = inject(HeadquartersService);
  private knowledgeService = inject(KnowledgeNetworkService);
  private message = inject(NzMessageService);
  private notification =inject(NzNotificationService)

  ngOnInit() {
    this.formData();
    this.getHeadquarters();
    this.getKnowledgeNetworks();
  }

  getHeadquarters() {
    this.headquarterService.getHeadquarters().subscribe({
      next: (data) => {
        this.headquarterList = data;

      },
    });
  }

  getKnowledgeNetworks() {
    this.knowledgeService.getknowledgeNetwork().subscribe({
      next: (data) => {
        this.knowlwdegeList = data;

      },
    });
  }


  saveData() {
    const data = this.formEnvironment.value;
    if (this.isEdit) {
      this.formEnvironment.get('headquarters_id')?.enable();
      data.headquarters_id = this.formEnvironment.get('headquarters_id')?.value;
      this.formEnvironment.get('headquarters_id')?.disable();

      this.environmentService.update(data).subscribe({
        next: () => {
          this.updateEnvironment.emit();
          this.notification.success('','Ambiente actualizado correctamente');
          this.closeModal();
        },
        error: (error) => {
          this.message.error('Erro al actualizar sede', error);
        },
      });
    } else {
      this.formEnvironment.get('headquarters_id')?.enable();
      data.headquarters_id = this.formEnvironment.get('headquarters_id')?.value;
      this.formEnvironment.get('headquarters_id')?.disable();
      
      this.environmentService.create(data).subscribe({
        next: () => {
          this.updateEnvironment.emit();
          this.notification.success('','Ambiente creada correctamente');
          this.closeModal();
        },
        error: (error) => {
          this.message.error('Error al crear la sede', error)
        },

      });
    }
  }



  //Metodo envirar la sede   
  setSelectedHeadquarter(id: number): void {
    this.formEnvironment.patchValue({
      headquarters_id: id
    })

  }



  //Metodo para recibir los datos y asiganrlos al formulario cuadno se edita
  setData(data: EnvironmentModel): void {
    this.isEdit = true
    this.environmentData = data;


    this.formEnvironment.patchValue({
      id: data.id,
      name: data.name,
      capacity: data.capacity,
      knowledge_network_id: data.knowledge_network_id,
      headquarters_id: data.headquarters_id,
    });

    this.formEnvironment.get('headquarters_id')?.disable();
  }


  //Metodo para validar los datos que entran al formulario  
  formData(): void {
    this.formEnvironment = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      capacity: new FormControl(null, Validators.required),
      headquarters_id: new FormControl(null, Validators.required),
      knowledge_network_id: new FormControl(null, Validators.required),

    });
    this.formEnvironment.get('headquarters_id')?.disable();

  }



  //Metodo para limpiar el modal de cualquier dato
  resetModal() {
    this.isEdit = false
    this.formEnvironment.reset();
  }

  //Metodo para abrir el modal 
  openModal() {
    this.isVisible = true;
  }

  //Metodo para cerrar el modal 
  closeModal() {
    this.resetModal();
    this.isVisible = false;
  }
}
