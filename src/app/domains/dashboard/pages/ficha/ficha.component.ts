import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, ViewChild } from '@angular/core';
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
schemas: [CUSTOM_ELEMENTS_SCHEMA], // Añadir este esquema
  templateUrl: './ficha.component.html',
  styleUrl:  './ficha.component.css'
})
export class FichaComponent {

  @ViewChild('sessionModal') sessionModal:any = SessionComponent;

  private courseService = inject(CourseService);

  pending_courses:SessionModel[] = [];
  record_courses:SessionModel[] = [];

  isVisible = false;
  createSessionOpen = false;
  anotherModalOpen = false;
  selectedTabIndex: number = 0;
  fichas = [
    {
      nombre: 'Ficha 1',
      sesiones: [
        { nombre: 'Sesion 1.1' },
        { nombre: 'Sesion 1.2' }
      ]
    },
    {
      nombre: 'Ficha 2',
      sesiones: [
        { nombre: 'Sesion 2.1' },
        { nombre: 'Sesion 2.2' }
      ]
    }
  ];
   // Métodos para manejar la edición y eliminación de sesiones
   editarSesion(sesion: any): void {
    console.log('Editando sesión:', sesion);
    // Lógica para editar la sesión
  }

  eliminarSesion(sesion: any): void {
    console.log('Eliminando sesión:', sesion);
    // Lógica para eliminar la sesión
  }


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
