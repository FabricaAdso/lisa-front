import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseModel } from '@shared/models/course.model';
import { ProgramModel } from '@shared/models/program.model';
import { CourseService } from '@shared/services/course.service';
import { ProgramService } from '@shared/services/program.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ficha',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NzTableModule,NzSelectModule,NzPaginationModule,NzInputModule],
  templateUrl: './ficha.component.html',
  styleUrl: './ficha.component.css'
})
export class FichaComponent implements OnInit {

  private courseService = inject(CourseService);
  private programService = inject(ProgramService);

  courses_model: CourseModel[] = [];
  programs: ProgramModel[] = [];
  page:number = 1;
  totalItems:number = 0;
  selectedProgramId: number | null = null;
  selectedProgram = '';
  courseSearch = '';


  ngOnInit(): void {
    this.getData();
  }

  getData(){
    const data_sub = forkJoin([
      this.programService.getPrograms(),
      this.courseService.getCoursesPage({included: ['program'], filterNormal:{'program_q': this.selectedProgram }, page: this.page},
      )]).subscribe({
        next: ([programs,response]) => {
          this.courses_model = response.data;
          this.programs = programs
          this.totalItems = response.total
        },
        error: (err) => {
          console.error(err);
        },complete(){
          data_sub.unsubscribe();
        }
      })
  }

  onProgramFilterChange(programId: number | null): void {
    this.selectedProgramId = programId;
    this.page = 1;
    this.selectedProgram  = this.programs.find(item => item.id === this.selectedProgramId)!.name
    this.getData()
  }

  loadForSearch(){
    const data_sub = forkJoin([
      this.courseService.getCourseSearch(this.courseSearch)
    ]).subscribe({
      next: ([courseSearch]) =>{
        this.courses_model = courseSearch;
      }
    })
  }

  onPageChange(page: number): void {
    this.page = page;
    this.getData();
  }

  changePage(event: Number){
    this.page = event as number;
    console.log(this.page);
    this.getData()
    
  }

}
