import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAreaDTO } from '@shared/dto/create-areaDTO';
import { CreateEvironentDTO } from '@shared/dto/create-environmentDTO';
import { AreaModel } from '@shared/models/area-model';
import { EnvironmentModel } from '@shared/models/environment-model';
import { SedeModel } from '@shared/models/Sedemodel';
import { AreaService } from '@shared/services/area.service';
import { EnvironmentService } from '@shared/services/environment.service';
import { HeadquartersService } from '@shared/services/headquarters.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { forkJoin, Subscription } from 'rxjs';
import { EnvironmentFormComponent } from './components/environment-form/environment-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';

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
    EnvironmentFormComponent,
  ],
  templateUrl: './environment.component.html',
  styleUrl: './environment.component.css'
})
export class EnvironmentComponent {

  private formBuilder = inject(FormBuilder);
  private environmentService = inject(EnvironmentService);
  private areaService = inject(AreaService);
  private headquarterService = inject(HeadquartersService);
  private nzMessageService = inject(NzMessageService);


  environments: EnvironmentModel[] = [];
  environment:EnvironmentModel|undefined = undefined;
  areas: AreaModel[] = [];
  headquarters: SedeModel[] = [];
  included:string[] = ['headquarters','environmentArea'];

  formEnvironments!: FormGroup | null;
  isModalVisible = false;
  isModalEditVisible = false;
  editingEnvironment: number | null = null;

  deleteSub:Subscription|null = null;


// ignorar esto
  nameFilter = ''; // Variable para almacenar el valor del filtro de nombre
  filteredEnvironments: EnvironmentModel[] = []; // Arreglo para datos filtrados

  ngOnInit(): void {
    this.loadData();// Carga los datos iniciales.
    this.createForm();
  }
  ngOnDestroy():void{
    if(this.deleteSub)this.deleteSub.unsubscribe();

  }
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }
  confirm(id: number): void {
    this.deleteEnvironment(id); // Llama a deleteHeadquarters con el id
    this.nzMessageService.info('Confirmación de eliminación');
  }

  deleteEnvironment(id: number) {
    const deleteSub = this.environmentService.delete(id).subscribe(() => {
      this.loadEnvironments; // Recarga la lista
      deleteSub.unsubscribe(); // Desuscribe del observable.
    });
  }


  loadData() {
    const datasub = forkJoin([
      this.environmentService.get({included:this.included}),
      this.areaService.get(),
      this.headquarterService.getHeadquartes(),


    ]).subscribe({
      next: ([enviroments, areas, headquarters]) => {
        this.environments = [...enviroments]
        this.filteredEnvironments = [...this.environments]; 
        this.areas = [...areas]
        this.headquarters = [...headquarters]



        console.log(enviroments)
        console.log('Sedes:', this.headquarters);
        console.log('Áreas:', this.areas);

      },
      complete: () => {
        datasub.unsubscribe();
      }
    });
  }

  applyFilter() {
    const filterValue = this.nameFilter.trim().toLowerCase();
    this.filteredEnvironments = this.environments.filter(environment =>
      environment.name.toLowerCase().includes(filterValue)
    );
  }
  trackById(index: number, item: EnvironmentModel): number {
    return item.id;
  }

  createForm() {
    this.formEnvironments = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      capacity: new FormControl(null, [Validators.required]),
      headquarters_id: new FormControl(null, [Validators.required]),
      environment_area_id: new FormControl(null, [Validators.required]),

    });
  }
  get fieldArea() {
    return this.formEnvironments!.get('area') as FormControl;
  }

  // Cargar las sedes existentes
  loadEnvironments() {
    this.environmentService.get({included:['']}).subscribe( {
      next:(data:EnvironmentModel[])=>{
        this.environments = data;

      }
      
    });
  }
  openEdit(environment:EnvironmentModel){
    this.environment = environment;
    this.isModalVisible = true;
  }
  edit(new_environment:EnvironmentModel){
    
    const {id}= new_environment;
    const index_environment= this.environments.findIndex((environmet)=>environmet.id===id);

    if(index_environment===null)return;

    let environments= [...this.environments];
    environments[index_environment]= new_environment;
    this.environments = environments ;
    this.closeModal()

  }
  create(environment:EnvironmentModel){
    console.log('entrando despues de emitir');
    
    this.environments = [...this.environments, environment];
    this.closeModal();
  }


  openModal(enviroment?: EnvironmentModel): void {
    this.isModalVisible = true;

    if (!this.formEnvironments) {
      this.createForm();
    }

    if (enviroment) {
      this.editingEnvironment = enviroment.id;
      this.formEnvironments?.patchValue({
        ...enviroment,

      });

    } else {
      this.editingEnvironment = null;
      this.formEnvironments?.reset();
    }
  }
  closeModal(): void {
    this.isModalVisible = false;
    this.formEnvironments?.reset();
    this.editingEnvironment = null;
  }

  saveData(): void {
    if (this.formEnvironments?.valid) {
      if (this.editingEnvironment) {
        const updatedEnvironment: EnvironmentModel = {
          id: this.editingEnvironment,
          ...this.formEnvironments.value
        };


        this.environmentService.update(updatedEnvironment).subscribe(() => {
          this.loadEnvironments();
          this.closeModal();
        });
      } else {
        // Si estamos creando un nuevo area
        const newEnvironment:CreateEvironentDTO = this.formEnvironments.value;
        this.environmentService.create(newEnvironment).subscribe(() => {
          this.loadEnvironments();  // Recargar la lista de sedes
          this.closeModal();        // Cerrar el modal
        });
      }
    } else {
      alert('Formulario incompleto o con errores.');
    }
  }



}
