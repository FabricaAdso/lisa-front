import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
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
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
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
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SessionEditComponent } from '../session-edit/session-edit.component';

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
    NzButtonModule, NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzPaginationModule, NzPopconfirmModule, NzIconModule, SessionEditComponent
  ],
  templateUrl: './manage-session.component.html',
  styleUrl: './manage-session.component.css'
})
export class ManageSessionComponent implements OnInit {
  sessions: SessionModel[] = [];
  loading = false;

  page: number = 1;
  elements: number = 10;
  last_page: number = 1;
  total: number = 0;
  page_options: number[] = [];

  selecion: { name: string, value: string, id: number } | null = null;
  select_sessions: { name: string, value: string, id: number }[] = [
    { name: "Realizadas", value: 'past', id: 1 },
    { name: "Pendientes", value: 'pending', id: 2 },
    { name: "Todas", value: 'all', id: 3 },
    { name: "Ultimas", value: 'end_date', id: 4 }
  ];




  courseFilter: string = '';
  rapFilter: string = '';
  instructorFilter: string = '';
  subjectFilter: string = '';

  courseOptions: Array<{ value: string, label: string }> = [];
  rapOptions: Array<{ value: string, label: string }> = [];
  instructorOptions: Array<{ value: string, label: string }> = [];

  allCourseOptions: Array<{ value: string, label: string }> = [];
  allRapOptions: Array<{ value: string, label: string }> = [];
  allInstructorOptions: Array<{ value: string, label: string }> = [];

  filters: { [key: string]: string | number } = {};

  private filterSubject = new Subject<void>();

  // Inyección de servicios
  private sessionService = inject(ManageSessionService);
  private courseService = inject(CourseService);
  private rapService = inject(RapService);
  private instructorService = inject(InstructorService);
  private notification = inject(NzNotificationService);
  private sessionse = inject(SessionService);

  ngOnInit(): void {
    this.selecion = this.select_sessions.find(s => s.name === 'Pendientes') || this.select_sessions[1];
    this.applySelectFilter();

    this.loadLeaderSessions();

    this.loadFilterOptions();
  }

  loadLeaderSessions(page: number = 1): void {
  // Convertir los valores de filters a string
  const filtersString: { [key: string]: string } = Object.keys(this.filters).reduce((acc, key) => {
    acc[key] = this.filters[key].toString();
    return acc;
  }, {} as { [key: string]: string });

    const queryParams = {
      ...filtersString,
      page: page.toString(),
      elements: this.elements.toString()
    };

    this.sessionse.getLeaderSessions(queryParams, [
      'instructor.user',
      'course',
      'course.program',
      'rap.subject'
    ]).subscribe({
      next: (resp: PaginateModel<SessionModel>) => {
        //console.log('Sesiones de líder:', resp);
        this.sessions = resp.data;
        this.page = resp.current_page;
        this.elements = resp.per_page;
        this.last_page = resp.last_page;
        this.total = resp.total;
        this.page_options = Array.from({ length: this.last_page }, (_, i) => i + 1);
      },
      error: (err) => console.error(err)
    });
  }



  changePage(page: number): void {
    this.loadLeaderSessions(page);
  }



  buildFilters(): { [key: string]: string } {
    const filtersCopy = { ...this.filters };
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
          value: session.instructor.id.toString(),
          label: `${session.instructor.user.name} ${session.instructor.user.last_name}`
        });
      }
    });

    if (!this.allCourseOptions.length) {
      this.allCourseOptions = Array.from(courseMap.values());
      this.allRapOptions = Array.from(rapMap.values());
      this.allInstructorOptions = Array.from(instructorMap.values());
    }

    this.courseOptions = [...this.allCourseOptions];
    this.rapOptions = [...this.allRapOptions];
    this.instructorOptions = [...this.allInstructorOptions];

    //console.log('Opciones de Curso:', this.courseOptions);
    //console.log('Opciones de RAP:', this.rapOptions);
    //console.log('Opciones de Instructor:', this.instructorOptions);

  }

  rapsByCourse: { [courseCode: string]: Array<{ value: string, label: string }> } = {};
  instructorsByCourse: { [courseCode: string]: Array<{ value: string, label: string }> } = {};

  // ... otros métodos

  loadFilterOptions(): void {
    this.sessionse.getFilterOptions().subscribe({
      next: (res: any) => {
        // Asigna y mapea las opciones de curso usando el code
        this.allCourseOptions = res.courses.map((course: any) => ({
          value: course.code.toString(),
          label: course.code ? course.code.toString() : 'N/D'
        }));
        // Asegúrate de que courseOptions también reciba esos datos
        this.courseOptions = [...this.allCourseOptions];

        // Mapear RAPs por curso (haciendo type assertion para TypeScript)
        this.rapsByCourse = {};
        Object.entries(res.rapsByCourse as Record<string, any[]>).forEach(([courseCode, raps]) => {
          this.rapsByCourse[courseCode] = raps.map(rap => ({
            value: rap.id.toString(),
            label: rap.description || 'N/D'
          }));
        });

        // Mapear Instructores por curso
        this.instructorsByCourse = {};
        Object.entries(res.instructorsByCourse as Record<string, any[]>).forEach(([courseCode, instructors]) => {
          this.instructorsByCourse[courseCode] = instructors.map(instructor => ({
            value: instructor.id.toString(),
            label: `${instructor.user.name} ${instructor.user.last_name}`
          }));
        });

        // Opciones iniciales vacías para RAP e Instructor
        this.rapOptions = [];
        this.instructorOptions = [];
      },
      error: (err) => console.error('Error al cargar opciones de filtros:', err)
    });
  }

  getFiltersString(): { [key: string]: string } {
    return Object.keys(this.filters).reduce((acc, key) => {
      acc[key] = this.filters[key].toString();
      return acc;
    }, {} as { [key: string]: string });
  }


  onCourseFilterChange(value: string): void {
    this.courseFilter = value;
    if (value) {
      this.filters['course_'] = value.trim();
      // Actualiza las opciones según el código de curso seleccionado
      this.rapOptions = this.rapsByCourse[value] || [];
      this.instructorOptions = this.instructorsByCourse[value] || [];
    } else {
      delete this.filters['course_'];
      this.rapOptions = [];
      this.instructorOptions = [];
    }

    // Reiniciar filtros dependientes
    this.rapFilter = '';
    this.instructorFilter = '';
    delete this.filters['rap_'];
    delete this.filters['instructor_'];

    // Al llamar al método que requiere solo strings, convierte los filtros
    this.sessionse.getFilterOptionsWithCourse(this.getFiltersString()).subscribe({
      next: (res: any) => {
        // Actualiza las opciones de RAP e Instructor según la respuesta
        this.rapOptions = res.rapsByCourse[value] ? res.rapsByCourse[value].map((rap: any) => ({
          value: rap.id.toString(),
          label: rap.description || 'N/D'
        })) : [];
        this.instructorOptions = res.instructorsByCourse[value] ? res.instructorsByCourse[value].map((inst: any) => ({
          value: inst.id.toString(),
          label: `${inst.user.name} ${inst.user.last_name}`
        })) : [];
      },
      error: (err) => console.error(err)
    });

    this.loadLeaderSessions();
  }





  onRapFilterChange(value: string): void {
    this.rapFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['rap_'] = value.trim();
    } else {
      delete this.filters['rap_'];
    }
    //console.log('Filtros actualizados:', this.filters);
    this.loadLeaderSessions();
  }

  onInstructorFilterChange(value: string): void {
    this.instructorFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['instructor_'] = value.trim();
    } else {
      delete this.filters['instructor_'];
    }
    //console.log('Filtros actualizados:', this.filters);
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

  onSelectSessionChange(selection: { name: string, value: string, id: number }): void {
    this.selecion = selection;
    this.applySelectFilter();
    //console.log('Filtros actualizados (estado):', this.filters);
    this.loadLeaderSessions();
  }

  private applySelectFilter(): void {
    if (this.selecion) {
      if (this.selecion.value === 'pending') {
        this.filters['pending'] = 'true';
        delete this.filters['past'];
        delete this.filters['end_date'];
      } else if (this.selecion.value === 'past') {
        this.filters['past'] = 'true';
        delete this.filters['pending'];
        delete this.filters['end_date'];
      } else if (this.selecion.value === 'end_date') {
        this.filters['end_date'] = 'true';
        delete this.filters['pending'];
        delete this.filters['past']
      } else { // "all"
        delete this.filters['pending'];
        delete this.filters['past'];
        delete this.filters['end_date'];
      }
    }
  }

  trackBySession(index: number, session: SessionModel): number {
    return session.id;
  }

  onDeleteSession(id: number): void {
    this.sessionse.deleteSession(id).subscribe({
      next: () => {
        this.notification.success('Eliminada', 'La sesión se eliminó correctamente');
        this.loadLeaderSessions();
      },
      error: (error) => {
        this.notification.error('Error', 'Ocurrió un error al eliminar la sesión');
        console.error('Error al eliminar la sesión:', error);
      }
    });
  }



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
    this.closeAnotherModal();
  }


  @ViewChild('sessionEdit') sessionEditComponent!: SessionEditComponent;


  openEditModal(sessionId: number): void {
    if (this.sessionEditComponent) {
      this.sessionEditComponent.sessionId = sessionId;
      this.sessionEditComponent.ngOnChanges({
        sessionId: {
          currentValue: sessionId,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });
      this.sessionEditComponent.openModal();
    } else {
      console.error('No se encontró la instancia de SessionEditComponent');
    }
  }



  isSessionEditable(session: SessionModel): boolean {
    const sessionDate = new Date(session.date);
    const sessionDateOnly = new Date(
      sessionDate.getFullYear(),
      sessionDate.getMonth(),
      sessionDate.getDate()
    );

    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return sessionDateOnly >= todayOnly;
  }

  onSessionCreated(response: SessionModel): void {
    // Actualiza la tabla
    this.loadLeaderSessions(this.page);
    // Actualiza las opciones de filtros
    this.loadFilterOptions();

  }




}
