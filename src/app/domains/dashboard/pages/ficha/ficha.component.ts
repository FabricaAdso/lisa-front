import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseModel } from '@shared/models/course.model';
import { InstructorModel } from '@shared/models/instructor.model';
import { ProgramModel } from '@shared/models/program.model';
import { CourseService } from '@shared/services/course.service';
import { InstructorService } from '@shared/services/instructor.service';
import { ProgramService } from '@shared/services/program.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';
import { AssignLeaderInstructorModalComponent } from './assign-leader-instructor-modal/assign-leader-instructor-modal.component';
import { CourseStateModalComponent } from './course-state-modal/course-state-modal.component';

@Component({
  selector: 'app-ficha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NzTableModule, NzSelectModule, NzPaginationModule, NzInputModule, NzIconModule, NzButtonModule, NzModalModule, NzFormModule, AssignLeaderInstructorModalComponent, CourseStateModalComponent],
  templateUrl: './ficha.component.html',
  styleUrl: './ficha.component.css'
})
export class FichaComponent implements OnInit, OnDestroy {

  @ViewChild('assignLeaderInstructorModal', {static:false}) assignLeaderInstructorModal:any = AssignLeaderInstructorModalComponent
  @ViewChild('courseStateModal', {static:false}) courseStateModal:any = CourseStateModalComponent

  private courseService = inject(CourseService);
  private programService = inject(ProgramService);
  

  courses_model: CourseModel[] = [];
  programs: ProgramModel[] = [];
  instructor_model:InstructorModel[] = [];
  page: number = 1;
  totalItems: number = 0;
  selectedProgramId: number | null = null;
  selectedProgram = '';
  courseSearch = '';
  isSearching = false;
  timeOut: any;
  courseSelected:any
  isVisibleAssignLeaderModal = false
  isVisibleCourseStateModal = false


  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.getData();
  }

  getData() {
    if (this.isSearching) {
      this.courses_model = []
      this.loadForSearch();
      return;
    }

    const data_sub = forkJoin([
      this.programService.getPrograms(),
      this.courseService.getCoursesPage({ included: ['program','course_leader.user'], filterNormal: { 'program_q': this.selectedProgram }, page: this.page },
      )]).subscribe({
        next: ([programs, response]) => {
          this.courses_model = response.data;
          this.programs = programs
          this.totalItems = response.total

          this.isVisibleAssignLeaderModal = false
          this.isVisibleCourseStateModal = false
        },
        error: (err) => {
          console.error(err);
        }, complete() {
          data_sub.unsubscribe();
        }
      })
  }

  onProgramFilterChange(programId: number | null): void {
    this.selectedProgramId = programId;
    this.page = 1;

    if (this.selectedProgramId === null) {
      this.selectedProgram = '';
      this.getData();
      return;
    }

    const foundProgram = this.programs.find(item => item.id === this.selectedProgramId);

    if (foundProgram) {
      this.selectedProgram = foundProgram.name;
    } 

    this.getData()
  }

  loadForSearch() {
    const data_sub = forkJoin([
      this.courseService.getCourseSearch(this.courseSearch)
    ]).subscribe({
      next: ([courseSearch]) => {

        this.courses_model = courseSearch;

      }, complete() {
        data_sub.unsubscribe();
      }
    })

  }

  resetToPagination() {
    this.isSearching = false;
    this.courseSearch = '';
    this.getData();
  }

  searchCourse(): void {
    this.isSearching = true;
    if (this.timeOut) {
      clearTimeout(this.timeOut)
    }

    this.timeOut = setTimeout(() => {
      const search = this.courseSearch.trim().toLocaleLowerCase();
      this.getData();
      if (!search) {
        this.resetToPagination()
        return;
      }
    }, 1000)

  }

  openModal(){
    if(this.isVisibleAssignLeaderModal){
      setTimeout(() => {
        if (this.assignLeaderInstructorModal) {
          this.assignLeaderInstructorModal.openModal();
        }
      });
    }if(this.isVisibleCourseStateModal){
      setTimeout(() => {
        if (this.courseStateModal) {
          this.courseStateModal.openModal();
        }
      });
    }

  }

  assignLeaderInstructor(event: number){  
    this.isVisibleAssignLeaderModal = true;
    this.openModal()
    this.courseSelected = this.courses_model.find(item => item.id == event)
  }

  courseState(event: number){
    this.isVisibleCourseStateModal = true;
    this.openModal()
    this.courseSelected = this.courses_model.find(item => item.id == event)
  }

  onSearchBlur(): void {
    if (!this.courseSearch.trim()) {
      this.resetToPagination();
    }
  }

  onPageChange(page: number): void {
    this.page = page;
    this.getData();
  }

  changePage(event: Number) {
    this.page = event as number;
    console.log(this.page);
    this.getData()
  }

  handleModalClose(shouldReset: boolean) {

    this.isVisibleAssignLeaderModal = false;
    this.isVisibleCourseStateModal = false;
    
    
    if (shouldReset) {
      this.getData();
      return;
    }
  }

}
