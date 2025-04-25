import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionModel } from '@shared/models/session.model';
import { CourseService } from '@shared/services/program/course.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { forkJoin } from 'rxjs';
import { SessionModalComponent } from './session-modal/session-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

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
    SessionModalComponent,
    NzModalModule,
    NzTabsModule,
],

  templateUrl: './session.component.html',
  styleUrl:  './session.component.css'
})
export class FichaComponent {

  @ViewChild('sessionModal') sessionModal:any = SessionModalComponent;
  private courseService = inject(CourseService);

  pending_courses:SessionModel[] = [];
  record_courses:SessionModel[] = [];
  createSessionOpen = false;
  anotherModalOpen = false;

  //abre modal del hijo session
  openModal() {
    if (this.sessionModal) {
      this.sessionModal.openModal();
    } else {
      console.error('No se encontró sessionModal.');
    }
  }
  openAnotherModal() {
    this.anotherModalOpen = true;

    // Aquí puedes usar otro componente o configuración de modal diferente
  }
  closeAnotherModal(){
    this.anotherModalOpen = false;

  }
  handleAnotherModalOk() {
    console.log('Otro modal confirmado');
    this.closeAnotherModal();
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    const data_sub = forkJoin([
      this.courseService.getCursesInstructorNow({ included: ['course.program'] }),
      this.courseService.getCouurseSessionsPast({ included: ['course.program'] }),
    ]).subscribe({
      next: ([courses,course_past]) => {
        if (!Array.isArray(courses) || courses.length === 0) {
          return;
        }
        this.pending_courses = courses;
        this.record_courses = course_past
      },
      error: (err) => {
        console.error('Error al cargar los cursos pendientes:', err);
      }
    })
    
  }
}
