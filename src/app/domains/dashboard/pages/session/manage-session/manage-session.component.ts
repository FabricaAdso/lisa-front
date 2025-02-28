import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SessionModel } from '@shared/models/session.model';
import { ManageSessionService } from '@shared/services/manage-session.service';
import { SessionService } from '@shared/services/program/session.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

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
    FormsModule
  ],
  templateUrl: './manage-session.component.html',
  styleUrl: './manage-session.component.css'
})
export class ManageSessionComponent implements OnInit {

  sessions: SessionModel[] = [];
  loading = false;
  selecion:{ name: string, id: number } | null = null;
  select_sessions: { name: string, id: number }[] = [
    {
      name: "past",
      id: 1
    },
    {
      name: "pending",
      id: 2
    }

  ]

  constructor(private sessionService: ManageSessionService) { }


  ngOnInit(): void {
    this.selecion = this.select_sessions.find(item => item.name === 'pending') || null;
    this.FilterSesion(this.selecion)
  }

  FilterSesion(tipo?:{ name: string, id: number }| null) {
    console.log(tipo);
    const filter = tipo ? { [tipo.name]: true } : {};
    this.sessionService.getSessions({
      filter: filter,
      included: ['instructor.user', 'course', 'course.program', 'course.program.subjects']
    }).subscribe({
      next: (sessions) => {
        this.sessions  = [...sessions]
      },
    });
  }




}
