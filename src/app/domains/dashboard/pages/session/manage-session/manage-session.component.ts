import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionModel } from '@shared/models/session.model';
import { ManageSessionService } from '@shared/services/manage-session.service';
import { SessionService } from '@shared/services/program/session.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-manage-session',
  standalone: true,
  imports: [CommonModule, RouterModule,NzTagModule],
  templateUrl: './manage-session.component.html',
  styleUrl: './manage-session.component.css'
})
export class ManageSessionComponent implements OnInit{

  sessions: SessionModel[] = [];
  loading = false;

  constructor(private sessionService: ManageSessionService) { }


  ngOnInit(): void {
    this.sessionService.getSessions({
  included: ['instructor.user','rap', 'course.program.subjects']
}).subscribe({
  next: (sessions) => {
    sessions.forEach(session => {
      console.log('Rap de la sesión:', session.subjects.rap);
      console.log('Nombre del instructor:', session.instructor?.user?.name);
      console.log('Sesiones con relaciones incluidas:', sessions);

    });
  },
  error: (err) => {
    console.error('Error loading sessions:', err);
  }
});



  }

  /* fetchSessions(): void {
    this.loading = true;
    this.sessionService.getSessions().subscribe({
      next: (data) => {
        this.sessions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching sessions:', err);
        this.loading = false;
      }
    });
  }; */


}
