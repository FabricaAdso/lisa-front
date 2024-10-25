import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, output, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { CreateProgramDto } from '@shared/dto/program/create-program-dto';
import { UpdateProgramDto } from '@shared/dto/program/update-program-dto';
import { EducationLevelModel } from '@shared/models/education-level.model';
import { ProgramModel } from '@shared/models/program.model';
import { EducationLevelService } from '@shared/services/program/education-level.service';
import { ProgramService } from '@shared/services/program/program.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { log } from 'ng-zorro-antd/core/logger';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule, NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-add-program-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule, 
    NzFormModule, 
    NzInputModule, 
    NzIconModule, 
    NzPopconfirmModule, 
    NzFlexModule, 
    NzSelectModule,
    NzModalModule,
    FormsModule, 
  ],
  templateUrl: './add-program-form.component.html',
  styleUrl: './add-program-form.component.css'
})
export class AddProgramFormComponent implements OnInit{

  Formprogram!: FormGroup;

  FormNivelFomracion: FormGroup;

  predefinedOptions:any =[]

  @Output() programData = new EventEmitter<ProgramModel>();
  education_level: EducationLevelModel[] = [];

  @Input() isVisible: boolean = false;
  @Output() onCancel = new EventEmitter<void>();
  
  isOtherSelected = false;

  @Input() isVisibleNivel: boolean = false;

  private programService = inject(ProgramService);
  private educationLevelService = inject(EducationLevelService);

  
  constructor(
    private Form: FormBuilder,
    private notification: NzNotificationService
  ) {

    this.Formprogram = this.Form.group({
      name: new FormControl (null, [Validators.required]),
      education_level_id: new  FormControl(null, [Validators.required]),
      custom_education_level: ['']
    });

    this.FormNivelFomracion = this.Form.group({
      name: new FormControl (null, [Validators.required]),
    });
  }
  

  ngOnInit(): void {
    this.obtenerNivelEducativo()
    
  }
  obtenerNivelEducativo(){
    this.educationLevelService.getAll().subscribe({
      next:(level)=>{
        this.education_level = level
      }
    })
  }


  crear: boolean = false;


  saveProgram() {
    if (!this.Formprogram || this.Formprogram.invalid) {
      alert("llena todos los datos");
      return;
    }
  
    const saveSub = this.programService.create(this.Formprogram.value).subscribe({
      next: (program) => {
        this.programData.emit(program)
      },
      complete: () => {
        saveSub.unsubscribe();
        this.Formprogram.reset();
        this.notification.success(
          'Notification programa',
          'Se creo asigino un programa correctamente'
        );
      },
      error : error =>{
        this.notification.success(
          'Notification programa',
          error.error
        );
      }
    });
  }


  resetForm(event: Event) {
    this.Formprogram.reset();
    event.preventDefault(); 
    this.onCancel.emit();
  }

  handleCancel(){
    this.isVisible = false
  }

  crearNivelFomracion(){
     this.isVisibleNivel = true
  }

  saveNivel(){
    this.educationLevelService.createLevel(this.FormNivelFomracion.value).subscribe({
      next:(level:EducationLevelModel)=>{
        this.education_level = [...this.education_level, level]
        this.FormNivelFomracion.reset();
        this.isVisibleNivel = false
      },
      error: error =>{
        console.log(error)
      }
    })
  }

  
}

