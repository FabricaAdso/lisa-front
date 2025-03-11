import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EnvironmentModel } from '@shared/models/environment-model';
import { HeadquarterModel } from '@shared/models/headquarter.model';
import { KnowledgeNetworkByInstructorModel } from '@shared/models/knowledg-network.model';
import { HeadquartersService } from '@shared/services/headquarters.service';
import { KnowledgeNetworkService } from '@shared/services/knowledge-network.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
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




  @Input() environmentData?: EnvironmentModel | null;

  //Declaracion de varibales
  isVisible = false;
  formEnvironment!: FormGroup;
  isEdit = false;
  headquarterList: HeadquarterModel[] = [];
  knowlwdegeList: KnowledgeNetworkByInstructorModel[] = [];

  //injeccion de servicios
  private headquarterService = inject(HeadquartersService);
  private knowledgeService = inject(KnowledgeNetworkService);

  ngOnInit() {
    this.formData();
    this.getHeadquarters();
    this.getKnowledgeNetworks();
  }

  getHeadquarters() {
    this.headquarterService.getHeadquarters().subscribe({
      next: (data) => {
        this.headquarterList = data;
        console.log('sedes', data);
      },
    });
  }

  getKnowledgeNetworks() {
    this.knowledgeService.getknowledgeNetwork().subscribe({
      next: (data) => {
        this.knowlwdegeList = data;
        console.log('areas', data);
      },
    });
  }

  setData(data: EnvironmentModel): void {
    this.environmentData = data;


    this.formEnvironment.patchValue({
      id: data.id,
      name: data.name,
      capacity: data.capacity,
      knowledge_network_id: data.knowledge_network_id,
      headquarters_id: data.headquarters_id,
    });
  }

  formData(): void {
    this.formEnvironment = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      capacity: new FormControl(null, Validators.required),
      headquarters_id: new FormControl(null, Validators.required),
      knowledge_network_id: new FormControl(null, Validators.required),

    });


  }

  openModal() {
    this.isVisible = true;
  }
  closeModal() {
    this.isVisible = false;
  }
}
