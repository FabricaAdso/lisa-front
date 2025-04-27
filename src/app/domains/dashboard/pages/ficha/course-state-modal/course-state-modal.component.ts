import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseModel } from '@shared/models/course.model';
import { CourseService } from '@shared/services/course.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-course-state-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NzModalModule,NzSelectModule,NzButtonModule,NzPopconfirmModule, NzFormModule],
  templateUrl: './course-state-modal.component.html',
  styleUrl: './course-state-modal.component.css'
})
export class CourseStateModalComponent implements OnInit{

  constructor(){
    this.formCourseState()
  }

  @Input() courses:CourseModel | null = null;
  @Output() modalClosed = new EventEmitter<boolean>();

  private courseService = inject(CourseService)
  private notification = inject(NzNotificationService)  
  private fb = inject(FormBuilder)

  state = ['Terminada', 'Terminar por unificacion', 'Terminar por fecha']

  selectedState: string = ''; 
  form!: FormGroup;

  isVisible = false;

  ngOnInit(): void {
    this.formCourseState()
  }

  formCourseState(){
    this.form = this.fb.group({
      course_name: new FormControl (null, Validators.required)
    });
  }

  get fieldCourseCode(){
    return this.form.get('course_name') as FormControl;
  }

  saveData(){
    if(this.fieldCourseCode.value){
      const data_sub = forkJoin([
        this.courseService.deleteCourse(this.courses?.id!)
      ]).subscribe({
        next:([course]) =>{
          this.isVisible = false
          this.notification.create(
            'success',
            'Curso eliminado',
            `El curso ${this.courses?.code} ha sido eliminado correctamente`
          )
          this.closeModal();
        },complete(){
          data_sub.unsubscribe()
        },
        error:(error) =>{
          console.log(error);
        }
      })
    }else{
      this.notification.create(
        'error',
        'Error',
        `El curso ${this.courses?.code} no ha sido eliminado`
      )
      this.fieldCourseCode.setErrors({ required: true });
    }
    
  }

  openModal(){
    this.isVisible = true;
  }

  closeModal(){
    this.isVisible = false;

  if (this.form && this.form.get('course_name')) {
    const hasCourseName = !!this.form.get('course_name')?.touched;
    this.modalClosed.emit(hasCourseName);
    console.log(hasCourseName); //devuelve true
    
  } else {
    this.modalClosed.emit(false);
  }

    
  }
  


}
