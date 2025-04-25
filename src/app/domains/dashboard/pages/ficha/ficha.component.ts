import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseModel } from '@shared/models/course.model';
import { ProgramModel } from '@shared/models/program.model';
import { CourseService } from '@shared/services/program/course.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ficha',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NzTableModule,NzSelectModule],
  templateUrl: './ficha.component.html',
  styleUrl: './ficha.component.css'
})
export class FichaComponent implements OnInit {

  private courseService = inject(CourseService);
  courses_model: CourseModel[] = [];
  uniquePrograms: ProgramModel[] = [];
  programFilter: string | null = null;
  filteredCourses: CourseModel[] = [];
  page:number = 1;
  per_page:number = 10;
  totalItems:number = 0;

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    const data_sub = forkJoin([
      this.courseService.getCoursesPage({included: ['program'], page: this.page, per_page: this.per_page},
      )]).subscribe({
        next: ([response]) => {
          this.courses_model = response.data;
          this.filteredCourses = [...this.courses_model];
          this.uniquePrograms = this.extractUniquePrograms(response.data);
          this.totalItems = response.total
          console.log(this.courses_model);
          console.log(this.uniquePrograms);
          console.log(this.filteredCourses);
          console.log(this.totalItems);
          
        },
        error: (err) => {
          console.error(err);
        }
      })
  }

  extractUniquePrograms(courses: CourseModel[]): ProgramModel[] {
    const programsMap = new Map<number, ProgramModel>();
    
    courses.forEach(course => {
      if (course.program && !programsMap.has(course.program.id)) {
        programsMap.set(course.program.id, course.program);
      }
    });
    
    return Array.from(programsMap.values());
  }

  onProgramFilterChange(programId: string): void {
    this.programFilter = programId;
    this.filteredCourses = programId 
      ? this.courses_model.filter(c => c.program?.id.toString() === programId)
      : [...this.courses_model];
  }

  onPageChange(page: number): void {
    this.page = page;
    this.getData();
  }

}
