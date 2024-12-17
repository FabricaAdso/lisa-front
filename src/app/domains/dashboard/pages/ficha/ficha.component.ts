import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionModel } from '@shared/models/session.model';
import { CourseService } from '@shared/services/program/course.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { forkJoin } from 'rxjs';
import { SessionComponent } from './session/session.component';
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
    SessionComponent,
    NzModalModule,
    NzTabsModule,



],

  templateUrl: './ficha.component.html',
  styleUrl:  './ficha.component.css'
})
export class FichaComponent {

  @ViewChild('sessionModal') sessionModal:any = SessionComponent;
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
    this.loadData();
  }

  loadData() {
    // Llamar al servicio para obtener las fichas pendientes y sus sesiones
    this.courseService.getCursesInstructorPending({ included: ['course.program'] }).subscribe({
      next: (data) => {
        this.pending_courses = data;  // Asigna las fichas al array
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  deleteSession(sessionId: number, courseId: number) {
    // Lógica para eliminar la sesión, usando el servicio correspondiente
    this.courseService.deleteSession(sessionId, courseId).subscribe({
      next: () => {
        // Después de eliminar, recargar las fichas y sus sesiones
        this.loadData();
        console.log('Sesión eliminada');
      },
      error: (error) => {
        console.error('Error al eliminar la sesión', error);
      }
    });
  }

}
