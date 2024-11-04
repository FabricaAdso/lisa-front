import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatTime } from '@shared/functions/format-time';
import { despartamentosModel } from '@shared/models/Departamentos.model';
import { municipiosModel } from '@shared/models/municipios.model';
import { SedeModel } from '@shared/models/Sedemodel';
import { TrainingCentreModel } from '@shared/models/training-centre-model';
import { HeadquartersService } from '@shared/services/headquarters.service';
import { LocationService } from '@shared/services/location.service';
import { TrainingCentreService } from '@shared/services/training-centre.service';
import { noWhiteSpaceValidator } from '@shared/validators/no-wite-space.validator';
import { timeRangeValidator } from '@shared/validators/time-validator';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-headquarter-form',
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
  templateUrl: './headquarter-form.component.html',
  styleUrl: './headquarter-form.component.css'
})
export class HeadquarterFormComponent {

  private formBuilder = inject(FormBuilder);
  private headquarterService = inject(HeadquartersService);
  private locationService = inject(LocationService);
  private trainingCentreService = inject(TrainingCentreService);
  private nzMessageService = inject(NzMessageService);
  
  @Input() headquarter?:SedeModel;
  @Input() isVisible:boolean = false;

  @Output() update = new EventEmitter<SedeModel>();
  @Output() create = new EventEmitter<SedeModel>();
  @Output() cancel = new EventEmitter<void>();

  form:FormGroup;
  saveSub:Subscription|null = null;
  dataSub:Subscription|null = null;
  municipalitySub:Subscription|null = null;
  touched:boolean = false;
  loading:boolean = false;

  departments: despartamentosModel[] = [];
  municipalities: municipiosModel[] = [];
  trainingCentres: TrainingCentreModel[] = [];

  constructor(){
    this.form = this.formBuilder.group({
      name:new FormControl(null,[Validators.required,noWhiteSpaceValidator()]),
      department:new FormControl(null,[Validators.required]),
      municipality_id:new FormControl(null,[Validators.required]),
      adress:new FormControl(null,[Validators.required,noWhiteSpaceValidator()]),
      training_center_id:new FormControl(null,[Validators.required]),
      opening_time:new FormControl(null,[Validators.required]),
      closing_time:new FormControl(null,[Validators.required]),
    }, { validators: timeRangeValidator });
  }
  ngOnInit(): void {
    this.loadData();
    this.form.valueChanges.subscribe(() => {
      if (this.form.errors) { // Solo imprime si hay errores
        console.log('Errores del formulario:', this.form.errors);
      }
    
    });
    
  }

  get fieldDepartment(){
    return this.form.get('department') as FormControl;
  }

  configForm(){

    if(this.headquarter){
      this.form.addControl('id',new FormControl(this.headquarter.id));
      this.form.get('name')!.setValue(this.headquarter.name);
      this.form.get('department')!.setValue(this.headquarter.municipality.departament_id);
      this.loadMunicipalities();
      this.form.get('adress')!.setValue(this.headquarter.adress);
      this.form.get('training_center_id')!.setValue(this.headquarter.training_center_id);
      this.form.get('opening_time')!.setValue(this.headquarter.opening_time);
      this.form.get('closing_time')!.setValue(this.headquarter.closing_time);
    }
  }

  onDepartmentChange() {
    // Reinicia el campo de municipio en el formulario
    this.form.get('municipality_id')!.setValue(null);
    this.municipalities = []; // Limpia la lista de municipios
    this.loadMunicipalities();
  }

  loadMunicipalities(){
    const {value:departmentId} = this.form.get('department') as FormControl;
    if (departmentId) {
      this.municipalitySub= this.locationService.getMunicipalities(departmentId).subscribe(municipalities => {
        this.municipalities = [...municipalities];
        console.log(this.touched);
        
        if (!this.touched&&this.headquarter) {
          this.touched = true;
          this.form.get('municipality_id')!.setValue(this.headquarter.municipality_id);
        }
      });
    }
  }

  loadData() {
    this.dataSub = forkJoin([
      this.trainingCentreService.getCentros(),
      this.locationService.getDepartments()
    ]).subscribe({
      next: ([trainingCentres, departments]) => {
        this.trainingCentres = [...trainingCentres];
        this.departments = [...departments];
        this.configForm()
      },
    });
  }




  ngOnDestroy(): void {
    this.dataSub!.unsubscribe();
    if(this.saveSub) this.saveSub.unsubscribe();
    if(this.municipalitySub) this.municipalitySub.unsubscribe();
  }

  saveData(){
    if (this.headquarter) {
      this.editHeadquarter();
      return;
    }
    this.createQuarter();
  }



  editHeadquarter(){
    if(this.form.invalid) return;
    this.loading = true; 
    const {value} = this.form;
    let update_value:SedeModel = {
      id:this.headquarter!.id,
      ...value
    }
    update_value.closing_time = formatTime(update_value.closing_time);
    update_value.opening_time = formatTime(update_value.opening_time);
    
    this.saveSub = this.headquarterService.update(update_value)
      .subscribe({
        next:(new_headquarter)=>{
          this.update.emit(new_headquarter);
        }
      });
  }
  createQuarter(){
    if(this.form.invalid) return;
    this.loading = true; 
    const {value} = this.form;
    this.saveSub = this.headquarterService.create(value)
      .subscribe({
        next:(new_headquarter)=>{
          this.create.emit(new_headquarter);
        }
      });
  }

  cancelForm(){
    this.cancel.emit();
    
    
  }

 


}
