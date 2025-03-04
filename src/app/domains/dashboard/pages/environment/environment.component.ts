import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EnvironmentModel } from '@shared/models/environment-model';
import { EnvironmentService } from '@shared/services/environment.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { HttpClient } from '@angular/common/http';
import { NzSpinModule } from 'ng-zorro-antd/spin';




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


export class EnvironmentComponent implements OnInit {

  private environmentService = inject(EnvironmentService);



  Environments:EnvironmentModel  []=[];
  filteredEnvironments: EnvironmentModel[] = [];
  headquartersList: any[] = [];
  selectedHeadquarter: number | null = null;
  isLoading = false;

  constructor(private http: HttpClient) {}

  getEnvironments(): void {
    const query = {
      included: ['headquarters', 'knowledge_network']
    };

    this.environmentService.getEnvironments(query).subscribe((environments) => {
      this.Environments = environments;
      this.filteredEnvironments = environments;

      // Sacamos las sedes sin repetir
      this.headquartersList = environments
        .map((env) => env.headquarters)
        .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
    });
  }

  filterByHeadquarters(headquarterId: number): void {
    if (!headquarterId) {
      this.filteredEnvironments = this.Environments;
      return;
    }
    this.filteredEnvironments = this.Environments.filter(
      (env) => env.headquarters.id === headquarterId
    );
  }
  trackByHeadquarter(index: number, item: any): number {
    return item.id;
  }

  ngOnInit(): void {

    this.getEnvironments();
  }

}







// export class EnvironmentComponent {
  

//   private formBuilder = inject(FormBuilder);
//   private environmentService = inject(EnvironmentService);
//   private knowledge_network = inject(KnowledgeNetworkService);
//   private headquarter = inject(HeadquartersService);



//   environments: EnvironmentModel[] = [];
//   networks: KnowledgeNetworkModel[] = [];
//   headquarters: SedeModel[] = [];

//   formEnvironments!: FormGroup | null;
//   isModalVisible = false;
//   editingEnvironment: number | null = null;

//   nameFilter = ''; // Variable para almacenar el valor del filtro de nombre
//   filteredEnvironments: EnvironmentModel[] = []; // Arreglo para datos filtrados

//   ngOnInit(): void {
//     this.getHeadquarters();
//     this.getNetworks();
//     this.getEnvironments();// Carga los datos iniciales.
//     this.createForm();
//   }
//   getHeadquarters():void{
//     this.headquarter.getHeadquarters().subscribe({
//       next: (res) => {
//         this.headquarters = res;
//       },
//       error: (err) => console.log(err)
//     });

//   }

//   getNetworks():void{
//     this.knowledge_network.getknowledgeNetwork().subscribe({
//       next: (res) => {
//         this.networks= res;
//       },
//       error: (err) => console.log(err)
//     });

//   }
//   getEnvironments(): void {
//     this.environmentService.getEnvironments().subscribe({
//       next: (res) => {
//         this.environments = res.map(env => ({
//           ...env,
//           headquarters_name: this.headquarters.find(h => h.id === env.headquarters_id)?.name ?? 'No encontrado',
//           knowledge_network_name: this.networks.find(n => n.id === env.knowledge_network_id)?.name ?? 'No encontrado'
//         }));
//         this.filteredEnvironments = this.environments;
//       },
//       error: (err) => console.error(err)
//     });
//   }

//   applyFilter() {
//     const filterValue = this.nameFilter.trim().toLowerCase();
//     this.filteredEnvironments = this.environments.filter(environment =>
//       environment.name.toLowerCase().includes(filterValue)
//     );
//   }
//   trackById(index: number, item: EnvironmentModel): number {
//     return item.id;
//   }

//   createForm() {
//     this.formEnvironments = this.formBuilder.group({
//       name: new FormControl(null, [Validators.required]),
//       capacity: new FormControl(null, [Validators.required]),
//       headquarters_id: new FormControl(null, [Validators.required]),
//       environment_area_id: new FormControl(null, [Validators.required]),

//     });
//   }

//   // Cargar las sedes existentes
//   loadEnvironments() {
//     // this.environmentService.get().subscribe(data => {
//     //   this.environments = data;
//     // });
//   }
//   deleteHeadquarters(id: number) { //para el boton
//     const deleteSub = this.environmentService.delete(id).subscribe(() => {
//       this.loadEnvironments(); // Recarga la lista de sedes.
//       deleteSub.unsubscribe(); // Desuscribe del observable.
//     });
//   }

//   openModal(enviroment?: EnvironmentModel): void {
//     this.isModalVisible = true;

//     if (!this.formEnvironments) {
//       this.createForm();
//     }

//     if (enviroment) {
//       this.editingEnvironment = enviroment.id;
//       this.formEnvironments?.patchValue({
//         ...enviroment,

//       });

//     } else {
//       this.editingEnvironment = null;
//       this.formEnvironments?.reset();
//     }
//   }
//   closeModal(): void {
//     this.isModalVisible = false;
//     this.formEnvironments?.reset();
//     this.editingEnvironment = null;
//   }

//   saveData(): void {
//     if (this.formEnvironments?.valid) {
//       if (this.editingEnvironment) {
//         const updatedEnvironment: EnvironmentModel = {
//           id: this.editingEnvironment,
//           ...this.formEnvironments.value
//         };


//         this.environmentService.update(updatedEnvironment).subscribe(() => {
//           this.loadEnvironments();
//           this.closeModal();
//         });
//       } else {
//         // Si estamos creando un nuevo area
//         const newEnvironment:CreateEvironentDTO = this.formEnvironments.value;
//         this.environmentService.create(newEnvironment).subscribe(() => {
//           this.loadEnvironments();  // Recargar la lista de sedes
//           this.closeModal();        // Cerrar el modal
//         });
//       }
//     } else {
//       alert('Formulario incompleto o con errores.');
//     }
//   }



// }
