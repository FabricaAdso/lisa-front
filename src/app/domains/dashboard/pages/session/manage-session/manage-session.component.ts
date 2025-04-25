import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SessionModel } from '@shared/models/session.model';
import { SessionService } from '@shared/services/program/session.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { SessionModalComponent } from '../session-modal/session-modal.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { PaginateModel } from '@shared/models/paginate.model';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SessionEditComponent } from '../session-edit/session-edit.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { DeleteSessionsRangeModalComponent } from "../delete-sessions-range-modal/delete-sessions-range-modal.component";
import { UpdateSessionsRangeModalComponent } from "../update-sessions-range-modal/update-sessions-range-modal.component";

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
    SessionModalComponent,
    NzButtonModule, NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzPaginationModule, NzPopconfirmModule, NzIconModule, SessionEditComponent, NzDropDownModule, NzMenuModule,
    DeleteSessionsRangeModalComponent,
    UpdateSessionsRangeModalComponent, NzSpaceModule
  ],
  templateUrl: './manage-session.component.html',
  styleUrl: './manage-session.component.css'
})
export class ManageSessionComponent implements OnInit {
  // Propiedades principales
  sessions: SessionModel[] = [];
  loading = false;

  // Paginación
  page: number = 1;
  elements: number = 10;
  last_page: number = 1;
  total: number = 0;
  page_options: number[] = [];

  // Filtros seleccionables
  selecion: { name: string, value: string, id: number } | null = null;
  select_sessions: { name: string, value: string, id: number }[] = [
    { name: "Realizadas", value: 'past', id: 1 },
    { name: "Pendientes", value: 'pending', id: 2 },
    { name: "Todas", value: 'all', id: 3 },
    { name: "Ultima", value: 'end_date', id: 4 }
  ];

  // Filtros por campos
  courseFilter: string = '';
  rapFilter: string = '';
  instructorFilter: string = '';
  subjectFilter: string = '';

  // Opciones de filtros
  courseOptions: Array<{ value: string, label: string }> = [];
  rapOptions: Array<{ value: string, label: string }> = [];
  instructorOptions: Array<{ value: string, label: string }> = [];

  allCourseOptions: Array<{ value: string, label: string }> = [];
  allRapOptions: Array<{ value: string, label: string }> = [];
  allInstructorOptions: Array<{ value: string, label: string }> = [];

  filters: { [key: string]: string | number } = {};
  rapsByCourse: { [courseCode: string]: Array<{ value: string, label: string }> } = {};
  instructorsByCourse: { [courseCode: string]: Array<{ value: string, label: string }> } = {};

  // Modales y estado de UI
  createSessionOpen = false;
  anotherModalOpen = false;
  pending_courses: SessionModel[] = [];
  record_courses: SessionModel[] = [];

  // Inyecciones
  private notification = inject(NzNotificationService);
  private sessionse = inject(SessionService);

  // Ciclo de vida
  ngOnInit(): void {
    this.selecion = this.select_sessions.find(s => s.name === 'Pendientes') || this.select_sessions[1];
    this.applySelectFilter();
    this.loadLeaderSessions();
    this.loadFilterOptions();
  }

  // Métodos de carga
  loadLeaderSessions(page: number = 1): void {
    const filtersString = Object.keys(this.filters)
      .reduce((acc, key) => ({ ...acc, [key]: this.filters[key].toString() }), {} as { [key: string]: string });

    const queryParams = {
      ...filtersString,
      page: page.toString(),
      elements: this.elements.toString()
    };

    this.sessionse.getLeaderSessions(queryParams, [
      'instructor.user', 'course', 'course.program', 'rap.subject'
    ]).subscribe({
      next: (resp: PaginateModel<SessionModel>) => {
        this.sessions = resp.data;
        this.page = resp.current_page;
        this.elements = resp.per_page;
        this.last_page = resp.last_page;
        this.total = resp.total;
        this.page_options = Array.from({ length: this.last_page }, (_, i) => i + 1);
        //  this.populateSelectOptions(this.sessions);
      },
      error: err => console.error(err)
    });
  }

  loadFilterOptions(): void {
    this.sessionse.getFilterOptions().subscribe({
      next: (res: any) => {
        // Cursos
        this.allCourseOptions = res.courses.map((c: any) => ({
          value: c.code.toString(),
          label: c.code ? c.code.toString() : 'N/D'
        }));
        this.courseOptions = [...this.allCourseOptions];

        // RAPs por curso
        this.rapsByCourse = {};
        Object.entries(res.rapsByCourse as Record<string, any[]>)
          .forEach(([code, raps]) => {
            this.rapsByCourse[code] = raps.map(rap => ({
              value: rap.id.toString(),
              label: rap.description || 'N/D'
            }));
          });

        // Instructores por curso
        this.instructorsByCourse = {};
        Object.entries(res.instructorsByCourse as Record<string, any[]>)
          .forEach(([code, instructors]) => {
            this.instructorsByCourse[code] = instructors.map(inst => ({
              value: inst.id.toString(),
              label: `${inst.user.name} ${inst.user.last_name}`
            }));
          });

        // Inicializa vacíos
        this.rapOptions = [];
        this.instructorOptions = [];
      },
      error: err => console.error('Error al cargar opciones de filtros:', err)
    });
  }

  // Métodos auxiliares
  buildFilters(): { [key: string]: string } {
    return Object.keys(this.filters)
      .reduce((acc, key) => ({ ...acc, [key]: this.filters[key].toString() }), {} as { [key: string]: string });
  }

  getFiltersString(): { [key: string]: string } {
    return this.buildFilters();
  }

  populateSelectOptions(sessions: SessionModel[]): void {
    const courseMap = new Map<string, { value: string, label: string }>();
    const rapMap = new Map<string, { value: string, label: string }>();
    const instructorMap = new Map<string, { value: string, label: string }>();

    sessions.forEach(session => {
      if (session.course?.id) {
        courseMap.set(session.course.code.toString(), {
          value: session.course.code.toString(),
          label: session.course.code.toString() || 'N/D'
        });
      }
      if (session.rap?.id) {
        rapMap.set(session.rap.id.toString(), {
          value: session.rap.id.toString(),
          label: session.rap.description || 'N/D'
        });
      }
      if (session.instructor?.user) {
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
  }

  applySelectFilter(): void {
    if (!this.selecion) return;

    const v = this.selecion.value;
    if (v === 'pending') {
      this.filters['pending'] = 'true';
      delete this.filters['past'];
      delete this.filters['end_date'];
    }
    else if (v === 'past') {
      this.filters['past'] = 'true';
      delete this.filters['pending'];
      delete this.filters['end_date'];
    }
    else if (v === 'end_date') {
      this.filters['end_date'] = 'true';
      delete this.filters['pending'];
      delete this.filters['past'];
    }
    else {
      delete this.filters['pending'];
      delete this.filters['past'];
      delete this.filters['end_date'];
    }
  }

  changePage(page: number): void {
    this.loadLeaderSessions(page);
  }

  trackBySession(index: number, session: SessionModel): number {
    return session.id;
  }

  isSessionEditable(session: SessionModel): boolean {
    const sd = new Date(session.date);
    const today = new Date();
    const sessionOnly = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return sessionOnly >= todayOnly;
  }

  // Métodos de filtro
  onCourseFilterChange(value: string): void {
    this.courseFilter = value;
    if (value) {
      this.filters['course_'] = value.trim();
      this.rapOptions = this.rapsByCourse[value] || [];
      this.instructorOptions = this.instructorsByCourse[value] || [];
    } else {
      delete this.filters['course_'];
      this.rapOptions = [];
      this.instructorOptions = [];
    }

    this.rapFilter = '';
    this.instructorFilter = '';
    delete this.filters['rap_'];
    delete this.filters['instructor_'];

    this.sessionse.getFilterOptionsWithCourse(this.getFiltersString()).subscribe({
      next: (res: any) => {
        this.rapOptions = res.rapsByCourse[value]?.map((rap: any) => ({
          value: rap.id.toString(), label: rap.description || 'N/D'
        })) || [];
        this.instructorOptions = res.instructorsByCourse[value]?.map((inst: any) => ({
          value: inst.id.toString(),
          label: `${inst.user.name} ${inst.user.last_name}`
        })) || [];
      },
      error: err => console.error(err)
    });

    this.loadLeaderSessions();
  }

  onRapFilterChange(value: string): void {
    this.rapFilter = value;
    if (value?.trim()) this.filters['rap_'] = value.trim();
    else delete this.filters['rap_'];
    this.loadLeaderSessions();
  }

  onInstructorFilterChange(value: string): void {
    this.instructorFilter = value;
    if (value?.trim()) this.filters['instructor_'] = value.trim();
    else delete this.filters['instructor_'];
    this.loadLeaderSessions();
  }

  onSubjectFilterChange(value: string): void {
    this.subjectFilter = value;
    if (value?.trim()) this.filters['subject_'] = value.trim();
    else delete this.filters['subject_'];
    this.loadLeaderSessions();
  }

  onSelectSessionChange(selection: { name: string, value: string, id: number }): void {
    this.selecion = selection;
    this.applySelectFilter();
    this.loadLeaderSessions();
  }

  // Eliminar sesiones
  onDeleteSession(id: number): void {
    this.sessionse.deleteSession(id).subscribe({
      next: () => {
        this.notification.success('Eliminada', 'La sesión se eliminó correctamente');
        this.loadLeaderSessions();
      },
      error: error => {
        this.notification.error('Error', 'Ocurrió un error al eliminar la sesión');
        console.error('Error al eliminar la sesión:', error);
      }
    });
  }

  @ViewChild('deleteRangeModal') deleteRangeModal!: DeleteSessionsRangeModalComponent;

  openDeleteByRangeModal(session: SessionModel): void {
    if (session.rap?.id && session.course?.code) {
      this.deleteRangeModal.rapId = session.rap.id;
      this.deleteRangeModal.courseId = Number(session.course.id);
      this.deleteRangeModal.open();
    } else {
      this.notification.error('Error', 'La sesión no tiene los datos necesarios');
    }
  }

  handleDeleteRangeConfirmed(): void {
    this.loadLeaderSessions(this.page);
  }

  // Edición de sesiones
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

  // Crear sesión
  @ViewChild('sessionModal') sessionModal!: SessionModalComponent;

  openModal(): void {
    if (this.sessionModal) {
      this.sessionModal.openModal();
    } else {
      console.error('No se encontró sessionModal.');
    }
  }

  onSessionCreated(response: SessionModel): void {
    this.loadLeaderSessions(this.page);
    this.loadFilterOptions();
  }

  // Modal adicional
  openAnotherModal(): void {
    this.anotherModalOpen = true;
  }

  closeAnotherModal(): void {
    this.anotherModalOpen = false;
  }

  handleAnotherModalOk(): void {
    this.closeAnotherModal();
  }

  // Actualización por rango
  @ViewChild('updateRangeModal') updateRangeModal!: UpdateSessionsRangeModalComponent;

  openUpdateByRangeModal(session: SessionModel): void {
    if (session.rap?.id && session.course?.id) {
      this.updateRangeModal.sessionId = session.id;
      this.updateRangeModal.rapId = session.rap.id;
      this.updateRangeModal.courseId = session.course.id;
      this.updateRangeModal.loadSessionData();
      this.updateRangeModal.openModal();
    }
  }

  handleUpdateRangeConfirmed(): void {
    this.loadLeaderSessions(this.page);
    this.notification.success('Éxito', 'Sesiones actualizadas correctamente');
  }

}
