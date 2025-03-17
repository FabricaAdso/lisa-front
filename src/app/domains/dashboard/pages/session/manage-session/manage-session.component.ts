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
import { InstructorService } from '@shared/services/instructor.service';
import { RapService } from '@shared/services/rap.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ChangeDetectorRef } from '@angular/core';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

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
    NzSelectModule,
    NzPaginationModule
],
  templateUrl: './manage-session.component.html',
  styleUrl: './manage-session.component.css'
})
export class ManageSessionComponent implements OnInit {
  sessions: SessionModel[] = [];
  loading = false;

  // Filtro de estado (por defecto, "pending")
  selecion: { name: string, id: number } | null = null;
  select_sessions: { name: string, id: number }[] = [
    { name: "past", id: 1 },
    { name: "pending", id: 2 },
    { name: "all", id: 3 }
  ];

  // Filtros adicionales (los valores actuales de cada select)
  courseFilter: string = '';
  rapFilter: string = '';
  instructorFilter: string = '';
  subjectFilter: string = '';

  // Arrays para las opciones de cada select
  courseOptions: Array<{ value: string, label: string }> = [];
  rapOptions: Array<{ value: string, label: string }> = [];
  instructorOptions: Array<{ value: string, label: string }> = [];

  // Variables para conservar la lista completa de opciones
  allCourseOptions: Array<{ value: string, label: string }> = [];
  allRapOptions: Array<{ value: string, label: string }> = [];
  allInstructorOptions: Array<{ value: string, label: string }> = [];

  // Objeto de filtros que se enviará en la petición
  filters: { [key: string]: string | number } = {};

  // Subject para aplicar debounce en los filtros (si lo llegas a usar)
  private filterSubject = new Subject<void>();

  // Inyección de servicios
  private sessionService = inject(ManageSessionService);
  private courseService = inject(CourseService);
  private rapService = inject(RapService);
  private instructorService = inject(InstructorService);
  private notification = inject(NzNotificationService);
  private sessionse = inject(SessionService);

  ngOnInit(): void {
    // Establecer el filtro por defecto para el estado ("pending")
    this.selecion = this.select_sessions.find(s => s.name === 'pending') || this.select_sessions[1];
    this.applySelectFilter();

    // Cargar inicialmente las sesiones de líder
    this.loadLeaderSessions();
  }

  loadLeaderSessions(): void {
    const stringFilters: { [key: string]: string } = this.buildFilters();
    this.sessionse.getLeaderSessions(stringFilters, ['instructor.user', 'course', 'course.program', 'rap.subject'])
      .subscribe({
        next: (resp: PaginateModel<SessionModel>) => {
          console.log('Sesiones de líder:', resp);
          this.sessions = resp.data;
          // Poblamos los selects usando la función; la primera vez se guardan las opciones completas
          this.populateSelectOptions(this.sessions);
        },
        error: (err) => console.error(err)
      });
  }

  buildFilters(): { [key: string]: string } {
    // Si el endpoint de líder no debe usar el filtro de instructor, lo removemos.
    const filtersCopy = { ...this.filters };

    // Convertimos a string
    return Object.keys(filtersCopy).reduce((acc, key) => {
      acc[key] = filtersCopy[key].toString();
      return acc;
    }, {} as { [key: string]: string });
  }

  populateSelectOptions(sessions: SessionModel[]): void {
    const courseMap = new Map<string, { value: string, label: string }>();
    const rapMap = new Map<string, { value: string, label: string }>();
    const instructorMap = new Map<string, { value: string, label: string }>();

    sessions.forEach(session => {
      if (session.course && session.course.id) {
        // Usamos el código como clave para evitar duplicados
        courseMap.set(session.course.code.toString(), {
          value: session.course.code.toString(),
          label: session.course.code ? session.course.code.toString() : 'N/D'
        });
      }
      if (session.rap && session.rap.id) {
        rapMap.set(session.rap.id.toString(), {
          value: session.rap.id.toString(),
          label: session.rap.description ? session.rap.description : 'N/D'
        });
      }
      if (session.instructor && session.instructor.user) {
        instructorMap.set(session.instructor.id.toString(), {
          value: session.instructor.id.toString(),  // Este es el valor que se enviará
          label: `${session.instructor.user.name} ${session.instructor.user.last_name}` // Lo que se muestra al usuario
        });
      }

    });

    // Si es la primera carga, guardamos la lista completa
    if (!this.allCourseOptions.length) {
      this.allCourseOptions = Array.from(courseMap.values());
      this.allRapOptions = Array.from(rapMap.values());
      this.allInstructorOptions = Array.from(instructorMap.values());
    }

    // Siempre usamos la copia completa para los selects, sin importar la lista filtrada
    this.courseOptions = [...this.allCourseOptions];
    this.rapOptions = [...this.allRapOptions];
    this.instructorOptions = [...this.allInstructorOptions];

    console.log('Opciones de Curso:', this.courseOptions);
    console.log('Opciones de RAP:', this.rapOptions);
    console.log('Opciones de Instructor:', this.instructorOptions);
  }

  // Métodos que se disparan cuando cambian los valores de cada select

  onCourseFilterChange(value: string): void {
    this.courseFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['course_'] = value.trim();
    } else {
      delete this.filters['course_'];
    }
    console.log('Filtros actualizados:', this.filters);
    this.loadLeaderSessions();
  }

  onRapFilterChange(value: string): void {
    this.rapFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['rap_'] = value.trim();
    } else {
      delete this.filters['rap_'];
    }
    console.log('Filtros actualizados:', this.filters);
    this.loadLeaderSessions();
  }

  onInstructorFilterChange(value: string): void {
    this.instructorFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['instructor_'] = value.trim();
    } else {
      delete this.filters['instructor_'];
    }
    console.log('Filtros actualizados:', this.filters);
    this.loadLeaderSessions();
  }

  onSubjectFilterChange(value: string): void {
    this.subjectFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['subject_'] = value.trim();
    } else {
      delete this.filters['subject_'];
    }
    console.log('Filtros actualizados:', this.filters);
    this.loadLeaderSessions();
  }

  onSelectSessionChange(selection: { name: string, id: number }): void {
    this.selecion = selection;
    this.applySelectFilter();
    console.log('Filtros actualizados (estado):', this.filters);
    this.loadLeaderSessions();
  }

  // Aplica el filtro de estado en el objeto filters según la opción seleccionada
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

  trackBySession(index: number, session: SessionModel): number {
    return session.id;
  }

  // Métodos para el modal
  @ViewChild('sessionModal') sessionModal!: SessionComponent;
  pending_courses: SessionModel[] = [];
  record_courses: SessionModel[] = [];
  createSessionOpen = false;
  anotherModalOpen = false;

  openModal(): void {
    if (this.sessionModal) {
      this.sessionModal.openModal();
    } else {
      console.error('No se encontró sessionModal.');
    }
  }

  openAnotherModal(): void {
    this.anotherModalOpen = true;
  }

  closeAnotherModal(): void {
    this.anotherModalOpen = false;
  }

  handleAnotherModalOk(): void {
    console.log('Otro modal confirmado');
    this.closeAnotherModal();
  }
}
