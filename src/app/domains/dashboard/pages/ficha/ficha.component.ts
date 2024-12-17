import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseModel } from '@shared/models/course.model';
import { SessionModel } from '@shared/models/session.model';
import { EnvironmentService } from '@shared/services/environment.service';
import { CourseService } from '@shared/services/program/course.service';
import { ProgramService } from '@shared/services/program/program.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { forkJoin } from 'rxjs';
import { SessionComponent } from './session/session.component';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-ficha',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzCollapseModule,
    NzButtonModule,
    NzGridModule,
    RouterModule,
    SessionComponent,
    NzModalModule
],
  templateUrl: './ficha.component.html',
  styleUrl: './ficha.component.css'
})
export class FichaComponent {

  @ViewChild('sessionModal') sessionModal:any = SessionComponent;

  private courseService = inject(CourseService); 
 
  pending_courses:SessionModel[] = [];
  record_courses:SessionModel[] = [];

  isVisible = false;
  createSessionOpen = false;


  //abre modal del hijo session
  openModal() {
    if (this.sessionModal) {
      this.sessionModal.openModal();
    } else {
      console.error('No se encontró sessionModal.');
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

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
      },
      error:(error)=>{
        console.error(error);
      }
    });
  }








 





}
