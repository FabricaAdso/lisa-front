import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AreaModel } from '@domains/dashboard/shared/models/area-model';
import { EnvironmentModel } from '@domains/dashboard/shared/models/environment-model';
import { SedeModel } from '@domains/dashboard/shared/models/Sedemodel';
import { AreaService } from '@domains/dashboard/shared/services/area.service';
import { EnvironmentService } from '@domains/dashboard/shared/services/environment.service';
import { HeadquartersService } from '@domains/dashboard/shared/services/headquarters.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-environment',
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
    NzSelectModule,
  ],
  templateUrl: './environment.component.html',
  styleUrl: './environment.component.css'
})
export class EnvironmentComponent {

  private fb = inject(FormBuilder);
  private environmentService = inject(EnvironmentService);
  private areaService = inject(AreaService);
  private headquarterService = inject(HeadquartersService);
  

  enviroments :EnvironmentModel[]=[];
  areas:AreaModel[] = [];
  headquarters: SedeModel[] = [];

  formEnviroments!: FormGroup | null;
  isModalVisible = false;
  editingEnvironment: number | null = null; 


  loadData() {
    const datasub = forkJoin([
      this.environmentService.get(),
      this.headquarterService.getHeadquartes(),
      this.areaService.get()
      
    ]).subscribe({
      next: ([enviroments, areas, headquarters ]) => {
        this.enviroments = [...enviroments]
        this.areas = [...areas]
        this.headquarters = [...headquarters]
        
        console.log(headquarters)
        console.log('Sedes:', this.headquarters); 
      console.log('Áreas:', this.areas); 
        
      },
      complete: () => {
        datasub.unsubscribe();
      }
    });
  }



}
