import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaginatedResponse, SessionModel } from '@shared/models/session.model';
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
import { NzFormModule } from 'ng-zorro-antd/form';
import { debounceTime, Subject } from 'rxjs';
import { PaginateModel } from '@shared/models/paginate.model';

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
    NzButtonModule,NzFormModule,
    NzInputModule,
    NzSelectModule
],
  templateUrl: './manage-session.component.html',
  styleUrl: './manage-session.component.css'
})
export class ManageSessionComponent implements OnInit {
  sessions: SessionModel[] = [];
  loading = false;

  // Opciones para filtrar por estado de la sesión
  selecion: { name: string, id: number } | null = null;
  select_sessions: { name: string, id: number }[] = [
    { name: "past", id: 1 },
    { name: "pending", id: 2 },
    { name: "all", id: 3 }
  ];

  // Objeto de filtros que se enviará en la petición
  filters: { [key: string]: string | number } = {};

  // Filtros adicionales:
  courseFilter: string = '';      // para filtrar por código de curso
  instructorFilter: string = '';  // para filtrar por instructor
  rapFilter: string = '';         // para filtrar por rap
  subjectFilter: string = '';     // para filtrar por competencia (subject)

  // Subject para disparar la búsqueda con debounce
  private filterSubject = new Subject<void>();

  constructor(private sessionService: ManageSessionService) {}


  ngOnInit(): void {
    // Por defecto, seleccionamos 'pending'
    this.selecion = this.select_sessions[1];
    this.applySelectFilter();  // Ajusta el filtro para 'pending'

    // Suscribirse al Subject con debounce
    this.filterSubject.pipe(
      debounceTime(500) // Espera 500ms después del último cambio
    ).subscribe(() => {
      this.FilterSesion();
    });

    // Llamar a la búsqueda inicial
    this.FilterSesion();
  }

  // Cuando cambie el input de código de curso
  onCourseFilterChange(value: string): void {
    this.courseFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['course_'] = value.trim();
    } else {
      delete this.filters['course_'];
    }
    // En lugar de llamar directamente a FilterSesion, disparamos el Subject
    this.filterSubject.next();
  }

  // Filtro instructor
  onInstructorFilterChange(value: string): void {
    this.instructorFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['instructor_'] = value.trim();
    } else {
      delete this.filters['instructor_'];
    }
    this.filterSubject.next();
  }

  // Filtro rap
  onRapFilterChange(value: string): void {
    this.rapFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['rap_'] = value.trim();
    } else {
      delete this.filters['rap_'];
    }
    this.filterSubject.next();
  }

  // Filtro subject
  onSubjectFilterChange(value: string): void {
    this.subjectFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['subject_'] = value.trim();
    } else {
      delete this.filters['subject_'];
    }
    this.filterSubject.next();
  }

  // Filtro de estado de la sesión
  onSelectSessionChange(selection: { name: string, id: number }): void {
    this.selecion = selection;
    this.applySelectFilter();
    this.filterSubject.next();
  }

  private applySelectFilter(): void {
    if (this.selecion) {
      if (this.selecion.name === 'pending') {
        this.filters['pending'] = 'true';
        delete this.filters['past'];
      } else if (this.selecion.name === 'past') {
        this.filters['past'] = 'true';
        delete this.filters['pending'];
      } else { // "all"
        delete this.filters['pending'];
        delete this.filters['past'];
      }
    }
  }

  // Lógica que hace la petición al backend
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
      next: (resp: PaginatedResponse<SessionModel>) => {
        this.sessions = resp.data;
      },
      error: (err) => console.error(err)
    });
  }

  // Resto de métodos para el modal
  @ViewChild('sessionModal') sessionModal!: SessionComponent;
  private courseService = inject(CourseService);

  pending_courses: SessionModel[] = [];
  record_courses: SessionModel[] = [];
  createSessionOpen = false;
  anotherModalOpen = false;

  openModal() {
    if (this.sessionModal) {
      this.sessionModal.openModal();
    } else {
      console.error('No se encontró sessionModal.');
    }
  }

  openAnotherModal() {
    this.anotherModalOpen = true;
  }

  closeAnotherModal() {
    this.anotherModalOpen = false;
  }

  handleAnotherModalOk() {
    console.log('Otro modal confirmado');
    this.closeAnotherModal();
  }
}
