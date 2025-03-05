import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SessionModel } from '@shared/models/session.model';
import { ManageSessionService } from '@shared/services/manage-session.service';
import { SessionService } from '@shared/services/program/session.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { SessionComponent } from '../session-modal/session.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CourseService } from '@shared/services/program/course.service';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-manage-session',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzTagModule,
    NzTableModule,
    NzTableModule,
    NzFlexModule,
    NzSpaceModule,
    NzDividerModule,
    NzSelectModule,
    FormsModule, NzInputModule,
    NzModalModule,
    NzGridModule,
    NzTabsModule,
    SessionComponent,
    NzButtonModule
],
  templateUrl: './manage-session.component.html',
  styleUrl: './manage-session.component.css'
})
export class ManageSessionComponent implements OnInit {

  sessions: SessionModel[] = [];
  loading = false;
  selecion: { name: string, id: number } | null = null;
  select_sessions: { name: string, id: number }[] = [
    { name: "past", id: 1 },
    { name: "pending", id: 2 },
    { name: "all", id: 3 }
  ];

  filters: { [key: string]: any } = {};

  courseFilter: string = '';
  constructor(private sessionService: ManageSessionService) { }

  ngOnInit(): void {
    this.selecion = this.select_sessions[1];
    this.applyCourseFilter();
    this.FilterSesion();
  }

  onCourseFilterChange(value: string): void {
    this.courseFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['course_'] = value;
    } else {
      delete this.filters['course_'];
    }
    this.FilterSesion();
  }

  private applyCourseFilter(): void {
    if (this.selecion && this.selecion.name !== 'all') {
      this.filters['course_'] = this.selecion.name;
    } else {
      delete this.filters['course_'];
    }
  }

  FilterSesion(): void {
    console.log('Filtros aplicados:', this.filters);
    this.sessionService.getSessions({
      filter: this.filters,
      included: [
        'instructor.user',
        'course',
        'course.program',
        'rap.subject'
      ]
    }).subscribe({
      next: (sessions) => {
        this.sessions = [...sessions];
      },
      error: (err) => console.error(err)
    });
  }


 /*  ngOnInit(): void {
    this.selecion = this.select_sessions[0];
     this.FilterSesion(this.selecion)
  }

  FilterSesion(tipo?:{ name: string, id: number }| null) {
    console.log(tipo);
    let filter= {};
    if (tipo && tipo.name !=='all'){
      filter = {[tipo.name]: true}
    }

    this.sessionService.getSessions({
      filter: filter,
      included: ['instructor.user', 'course.program'
        ,'rap', 'rap.subject']
    }).subscribe({
      next: (sessions) => {
        console.log('Sesiones recibidas:', sessions);

        this.sessions  = [...sessions]
      },
    });
  } */
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

    deleteSession(sessionId: number, courseId: number) {
      // Lógica para eliminar la sesión, usando el servicio correspondiente
      // this.courseService.deleteSession(sessionId, courseId).subscribe({
      //   next: () => {
      //     // Después de eliminar, recargar las fichas y sus sesiones
      //     this.loadData();
      //     console.log('Sesión eliminada');
      //   },
      //   error: (error) => {
      //     console.error('Error al eliminar la sesión', error);
      //   }
      // });
    }


}
