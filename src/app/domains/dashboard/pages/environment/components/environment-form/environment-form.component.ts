import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AreaModel } from '@shared/models/area-model';
import { EnvironmentModel } from '@shared/models/environment-model';
import { SedeModel } from '@shared/models/Sedemodel';
import { AreaService } from '@shared/services/area.service';
import { EnvironmentService } from '@shared/services/environment.service';
import { HeadquartersService } from '@shared/services/headquarters.service';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-environment-form',
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
  templateUrl: './environment-form.component.html',
  styleUrl: './environment-form.component.css'
})
export class EnvironmentFormComponent {

  private formBuilder = inject(FormBuilder);
  private environmentService = inject(EnvironmentService);
  private headquarterService = inject(HeadquartersService);
  private areaService = inject(AreaService);
  private nzMessageService = inject(NzMessageService);

  @Input() environment?:EnvironmentModel;
  @Input() isVisible:boolean = false;
  @Input() included?:string[];

  @Output() update = new EventEmitter<EnvironmentModel>();
  @Output() create = new EventEmitter<EnvironmentModel>();
  @Output() cancel = new EventEmitter<void>();

  form:FormGroup;
  saveSub:Subscription|null = null;
  dataSub:Subscription|null = null;

  touched:boolean = false;
  loading:boolean = false;

  headquarters:SedeModel[]= [];
  areas:AreaModel[] = [];

  constructor(){
    this.form = this.formBuilder.group({
      name:new FormControl(null,[Validators.required,noWhiteSpaceValidator()]),
      capacity:new FormControl(null,[Validators.required]),
      environment_area_id: new FormControl(null,[Validators.required]),
      headquarters_id: new FormControl([null,[Validators.required]]),

    });

  }
  ngOnInit(): void {
    this.loadData();
    
    
  }
  loadData() {
    this.dataSub = forkJoin([
      this.headquarterService.getHeadquartes(),
      this.areaService.get(),
    ]).subscribe({
      next: ([headquarters, areas]) => {
        this.headquarters = [...headquarters];
        this.areas = [...areas];
        this.configForm()
      },
    });
  }
  configForm(){

    if(this.environment){
      this.form.addControl('id',new FormControl(this.environment.id));
      this.form.get('name')!.setValue(this.environment.name);
      this.form.get('capacity')!.setValue(this.environment.capacity);
      this.form.get('environment_area_id')!.setValue(this.environment.environment_area_id);
      this.form.get('headquarters_id')!.setValue(this.environment.headquarters_id);
     
    }
  }
  ngOnDestroy(): void {
    this.dataSub!.unsubscribe();
    if(this.saveSub) this.saveSub.unsubscribe();
    
  }

  saveData(){
    if (this.environment) {
      this.editEnvironment();
      return;
    }
    this.createEnvironment();
  }

  editEnvironment(){
    if(this.form.invalid) return;
    this.loading = true; 
    const {value} = this.form;
    let update_value:EnvironmentModel = {
      id:this.environment!.id,
      ...value
    }

    
    
    this.saveSub = this.environmentService.update(update_value,{included:this.included})
      .subscribe({
        next:(new_environment)=>{
          this.update.emit(new_environment);
          
        }
      });
  }

  createEnvironment(){
    if(this.form.invalid) return;
    this.loading = true; 
    const {value} = this.form;
    this.saveSub = this.environmentService.create(value,{included:this.included})
      .subscribe({
        next:(new_environmet)=>{
          this.create.emit(new_environmet);
          
        }
      });

  }
  cancelForm(){
    this.cancel.emit();
    
    
  }
  onlyNumbers(event: KeyboardEvent) {
    if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  }


 





}
