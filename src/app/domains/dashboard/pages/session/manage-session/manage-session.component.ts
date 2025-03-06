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
import { NzFormModule } from 'ng-zorro-antd/form';

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

  constructor(private sessionService: ManageSessionService) { }

  ngOnInit(): void {
    // Por defecto, seleccionamos 'pending'
    this.selecion = this.select_sessions[1];
    this.applySelectFilter();
    this.applyCourseFilter();
    // Si desea inicializar otros filtros con algún valor por defecto, hágalo aquí.
    this.FilterSesion();
  }

  // Método que se dispara cuando cambia el input para el código de curso
  onCourseFilterChange(value: string): void {
    this.courseFilter = value;
    if (value && value.trim().length > 0) {
      // Usamos la clave 'course_' para filtrar por código de curso
      this.filters['course_'] = value.trim();
    } else {
      delete this.filters['course_'];
    }
    console.log('Filters after course change:', this.filters);
    this.FilterSesion();
  }

  // Método para cuando se cambia el filtro de instructor
  onInstructorFilterChange(value: string): void {
    this.instructorFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['instructor_'] = value.trim();
    } else {
      delete this.filters['instructor_'];
    }
    console.log('Filters after instructor change:', this.filters);
    this.FilterSesion();
  }

  // Método para cuando se cambia el filtro de rap
  onRapFilterChange(value: string): void {
    this.rapFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['rap_'] = value.trim();
    } else {
      delete this.filters['rap_'];
    }
    console.log('Filters after rap change:', this.filters);
    this.FilterSesion();
  }

  // Método para cuando se cambia el filtro de competencia (subject)
  onSubjectFilterChange(value: string): void {
    this.subjectFilter = value;
    if (value && value.trim().length > 0) {
      this.filters['subject_'] = value.trim();
    } else {
      delete this.filters['subject_'];
    }
    console.log('Filters after subject change:', this.filters);
    this.FilterSesion();
  }

  // Método para el filtro del estado de la sesión (pending, past o all)
  onSelectSessionChange(selection: { name: string, id: number }): void {
    this.selecion = selection;
    this.applySelectFilter();
    this.FilterSesion();
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

  private applyCourseFilter(): void {
    if (this.courseFilter && this.courseFilter.trim().length > 0) {
      this.filters['course_'] = this.courseFilter.trim();
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

    // metodos relacionados al modal y demas
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




