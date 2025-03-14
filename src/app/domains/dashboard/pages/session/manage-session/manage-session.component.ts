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
import { NzIconModule } from 'ng-zorro-antd/icon';

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
    NzPaginationModule,
    NzIconModule

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

  // Objeto de filtros que se enviará en la petición
  filters: { [key: string]: string | number } = {};

  // Subject para aplicar debounce en los filtros
  private filterSubject = new Subject<void>();

  // Inyección de servicios (puedes usar DI con inject o en el constructor)
  private sessionService = inject(ManageSessionService);
  private courseService = inject(CourseService);
  private rapService = inject(RapService);
  private instructorService = inject(InstructorService);
  private notification = inject(NzNotificationService);
  private sessionse = inject(SessionService)

  ngOnInit(): void {
    // 1. Establecer el filtro por defecto para el estado ("pending")
    this.selecion = this.select_sessions.find(s => s.name === 'pending') || this.select_sessions[1];
    this.applySelectFilter();

    // 2. Configurar el subject para agrupar (debounce) cambios en los filtros
    this.filterSubject.pipe(debounceTime(500))
      .subscribe(() => {
        this.FilterSesion();
      });
    this.FilterSesion();


    const stringFilters: { [key: string]: string } = Object.keys(this.filters).reduce((acc, key) => {
      acc[key] = this.filters[key].toString();
      return acc;
    }, {} as { [key: string]: string });

    console.log('String filters:', stringFilters);

    this.sessionse.getAlltwo(stringFilters, ['instructor.user', 'course', 'rap'])
      .subscribe((response: PaginateModel<SessionModel>) => {
        console.log('Respuesta completa de getAlltwo:', response);
        const sessionsArray = response.data; // Accedes al array real de sesiones
        console.log('Array de sesiones:', sessionsArray);

        const rapMap = new Map<string, { value: string, label: string }>();
        const courseMap = new Map<string, { value: string, label: string }>();
        const instructorMap = new Map<string, { value: string, label: string }>();

        sessionsArray.forEach(session => {
          if (session.rap && session.rap.id) {
            rapMap.set(session.rap.id.toString(), {
              value: session.rap.description.toString(),
              label: session.rap.description
            });
          }
          if (session.course && session.course.id) {
            courseMap.set(session.course.id.toString(), {
              value: session.course.code.toString(),
              label: session.course.code.toString()
            });
          }
          if (session.instructor && session.instructor.user) {
            instructorMap.set(session.instructor.id.toString(), {
              value: session.instructor.user.name.toString(),
              label: session.instructor.user.name + ' ' + session.instructor.user.last_name
            });
          }
        });

        this.instructorOptions = Array.from(instructorMap.values());
        this.rapOptions = Array.from(rapMap.values());
        this.courseOptions = Array.from(courseMap.values());

        console.log('Opciones de RAP:', this.rapOptions);
        console.log('Opciones de Curso:', this.courseOptions);
        console.log('Opciones de Instructor:', Array.from(instructorMap.values()));
      });

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

    this.filterSubject.next();
  }

  onRapFilterChange(value: string): void {
    this.rapFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['rap_'] = value.trim();
    } else {
      delete this.filters['rap_'];
    }
    this.filterSubject.next();
  }

  onInstructorFilterChange(value: string): void {
    this.instructorFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['instructor_'] = value.trim();
    } else {
      delete this.filters['instructor_'];
    }
    this.filterSubject.next();
  }

  onSubjectFilterChange(value: string): void {
    this.subjectFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['subject_'] = value.trim();
    } else {
      delete this.filters['subject_'];
    }
    this.filterSubject.next();
  }

  onSelectSessionChange(selection: { name: string, id: number }): void {
    this.selecion = selection;
    this.applySelectFilter();
    this.filterSubject.next();
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

  // Lógica para hacer la petición al backend con los filtros aplicados
 FilterSesion(): void {
  console.log('Filtros aplicados:', this.filters);
  const stringFilters: { [key: string]: string } = Object.keys(this.filters).reduce((acc, key) => {
    acc[key] = this.filters[key].toString();
    return acc;
  }, {} as { [key: string]: string });

  this.sessionse.getAlltwo(stringFilters, ['instructor.user', 'course', 'course.program', 'rap.subject'])
    .subscribe({
      next: (resp: PaginatedResponse<SessionModel>) => {
        console.log('Respuesta de sesiones:', resp);
        this.sessions = resp.data;
        console.log('Número de sesiones:', this.sessions.length);
      },
      error: (err) => console.error(err)
    });
}

trackBySession(index: number, session: SessionModel): number {
  return session.id;
}


onDeleteSession(id: number): void {
  // Opcional: confirmar la eliminación
  if (!confirm('¿Estás seguro de eliminar esta sesión?')) {
    return;
  }

  // Llamada al servicio para borrar la sesión
  this.sessionse.deleteSession(id).subscribe({
    next: (res) => {
      // Actualiza la lista eliminando el item borrado
      this.sessions = this.sessions.filter(session => session.id !== id);
      // Opcional: muestra una notificación de éxito
      this.notification.success('Eliminado', 'Sesión eliminada exitosamente');
    },
    error: (err) => {
      console.error('Error al eliminar la sesión', err);
      // Opcional: muestra una notificación de error
      this.notification.error('Error', 'No se pudo eliminar la sesión');
    }
  });
}
  // Resto de métodos para el modal
  @ViewChild('sessionModal') sessionModal!: SessionComponent;

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

  onSessionCreated(newSession: SessionModel): void {
    // En lugar de solo agregar el objeto, recarga la tabla completa:
    this.FilterSesion();
  }


  // Paginado

  elements: number = 9;
  page: number = 1;
  last_page: number = 0;
  total_elements: number = 0;
  page_options: number[] = [];

  
}
