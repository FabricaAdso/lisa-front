import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseModel } from '@shared/models/course.model';
import { InstructorModel } from '@shared/models/instructor.model';
import { CourseService } from '@shared/services/course.service';
import { InstructorService } from '@shared/services/instructor.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-assign-leader-instructor-model',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,NzModalModule,NzSelectModule,NzFormModule,NzInputModule],
  templateUrl: './assign-leader-instructor-modal.component.html',
  styleUrl: './assign-leader-instructor-modal.component.css'
})
export class AssignLeaderInstructorModalComponent implements OnInit{

  @Input() courses:CourseModel | null = null; 
  @Output() modalClosed = new EventEmitter<boolean>();

  private fb = inject(FormBuilder)
  private instructorService = inject(InstructorService)
  private courseService = inject(CourseService)
  private notification = inject(NzNotificationService)

  form!:FormGroup
  instructor_model:InstructorModel[] | [] = [];
  courseCode:any
  courseId:any


  isVisible = false

  ngOnInit(): void {
    this.getData();
    this.formAssingLeaderInstructor();
  }
  getData(){ 
      const data_sub = forkJoin([
        this.instructorService.getInstructors({included:['user']})
      ]).subscribe({
        next:([instructor]) =>{
          this.instructor_model = instructor
        }
      })
      
    }

    saveData(){
      const data = this.form.value
      if(data){
        const instructor_id = this.form.get('instructor')?.value
        const course_id = this.courses?.id
        console.log(course_id, instructor_id);
        

        this.courseService.postCourseLeaderInstructor(course_id!,instructor_id).subscribe({
          next: (res) =>{
            this.isVisible = false
            this.form.reset()
            this.getData()
            this.notification.create(
              'success',
              'Exito',
              'Instructor asignado correctamente'
            )
          },
          error: (err) =>{
            console.log(err)
          }
        })
      }
      this.closeModal()
      
    
  }
      

  formAssingLeaderInstructor(){
    this.form = this.fb.group({
      instructor: new FormControl('',[Validators.required]),
      courses: new FormControl('',[Validators.required]),
    })   
  

  }

  openModal(){
    this.isVisible = true
  }

  closeModal(){
    this.isVisible = false;
    if(!this.isVisible){
      this.modalClosed.emit(true);
    }
  }

}
