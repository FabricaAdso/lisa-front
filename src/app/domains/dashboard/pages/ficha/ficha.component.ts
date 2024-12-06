import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CourseModel } from '@shared/models/course.model';
import { SessionModel } from '@shared/models/session.model';
import { EnvironmentService } from '@shared/services/environment.service';
import { CourseService } from '@shared/services/program/course.service';
import { ProgramService } from '@shared/services/program/program.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ficha',
  standalone: true,
  imports:  [
    CommonModule,
    NzCardModule,
    NzCollapseModule,
    NzButtonModule,
    NzGridModule
  ],
  templateUrl: './ficha.component.html',
  styleUrl: './ficha.component.css'
})
export class FichaComponent {

  private courseService = inject(CourseService); 
  private programService = inject(ProgramService);
  private environmentService = inject(EnvironmentService);

  pending_courses:SessionModel[] = [];

  ngOnInit(): void {
    this.loadData();
    
  }

  loadData(){
    const datasub= forkJoin([
      this.courseService.getCursesInstructorPending({included:['course.program']}),

    ]).subscribe({
      next:([pending])=>{
        this.pending_courses = pending;
        console.log(this.pending_courses);
      }
    });
  }








 





  fichas = [
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },

    
  ];

  historialFichas = [
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    {
      number: 2774315,
      program: 'Análisis y desarrollo de software',
      site: 'Inem',
      environment: 105,
      session: '7:00 - 13:00',
      date: '13/09/2024'
    },
    
  ];



}
