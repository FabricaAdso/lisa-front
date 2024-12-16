import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionModel } from '@shared/models/session.model';
import { CourseService } from '@shared/services/program/course.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { forkJoin } from 'rxjs';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-ficha',
  standalone: true,
  
  imports:  [
    CommonModule,
    NzCardModule,
    NzCollapseModule,
    NzButtonModule,
    NzGridModule,
    RouterModule,
    NzButtonModule
  ],
  templateUrl: './ficha.component.html',
  styleUrl: './ficha.component.css'
})
export class FichaComponent {

  private courseService = inject(CourseService); 
 
  pending_courses:SessionModel[] = [];
  record_courses:SessionModel[] = [];
  isvisible=false;
  ngOnInit(): void {
    this.loadData();
    
  }

  loadData(){
    const datasub= forkJoin([
      this.courseService.getCursesInstructorPending({included:['course.program']}),
      this.courseService.getCursesInstructorRecord({included:['course.program']}),

    ]).subscribe({
      next:([pending,record] )=>{
        this.pending_courses = pending;
        this.record_courses = record;
        console.log('pending',this.pending_courses);
        console.log('Record Courses:', this.record_courses);
      }
    });
  }
  openModal() {
  
  }







 





}
