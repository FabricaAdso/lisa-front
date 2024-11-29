import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';

import { SessionModel } from '@shared/models/session.model';
import { SessionService } from '@shared/services/program/session.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    NzModalModule,
    NzButtonModule,
    NzTimelineModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  isVisible = false; // Estado del modal
  selectedEvent: { title: string; sessions: SessionModel[] } | null = null;

  // Sesiones iniciales con estado de asistencia
  initialEvents: SessionModel[] = [];

  // Opciones del calendario
  calendarOptions: any = {
    plugins: [interactionPlugin, dayGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    events: [], // Inicialmente vacío
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.sessionService.getAll().subscribe({
      next: (sessions) => {
        this.initialEvents = sessions;
        this.updateCalendarEvents(); // Actualiza los eventos del calendario
      },
      error: (err) => {
        console.error('Error loading sessions:', err);
      },
    });
  }

  // Maneja el clic en un evento para mostrar el modal
  handleEventClick(clickInfo: EventClickArg) {
    const eventDate = clickInfo.event.startStr.split('T')[0];
    const sessionsForDay = this.getSessionsForDay(eventDate);

    this.selectedEvent = {
      title: `Sesiones del día ${eventDate}`,
      sessions: sessionsForDay,
    };

    this.isVisible = true;
  }

  // Obtiene las sesiones para una fecha específica
  getSessionsForDay(date: string): SessionModel[] {
    return this.initialEvents.filter((event) => event.date === date);
  }

  // Obtiene el color para el timeline
  getTimelineColor(session: SessionModel): string {
    const today = new Date().toISOString().split('T')[0];
    if (session.date === today) return 'blue'; // Sesión actual
    if (session.date > today) return 'gray'; // Sesión futura
    if (session.attendanceTaken === true) return 'green'; // Sesión pasada con asistencia tomada
    if (session.attendanceTaken === false) return 'red'; // Sesión pasada sin asistencia
    return 'gray'; // Default
  }

  // Agrupa las sesiones en días y actualiza los eventos del calendario
  updateCalendarEvents(): void {
    const groupedEvents = this.getGroupedSessions();
    this.calendarOptions.events = groupedEvents; // Actualiza los eventos dinámicamente
  }

  // Agrupa las sesiones en días
  getGroupedSessions() {
    const groupedEvents: { [key: string]: number } = {};

    this.initialEvents.forEach((event) => {
      groupedEvents[event.date] = (groupedEvents[event.date] || 0) + 1;
    });

    return Object.keys(groupedEvents).map((date) => ({
      title: `${groupedEvents[date]} Sesión${groupedEvents[date] !== 1 ? 'es' : ''}`,
      start: `${date}T00:00:00`,
      description: `${groupedEvents[date]} sesiones programadas`,
      display: 'block',
    }));
  }

  // Oculta el modal
  handleCancel() {
    this.isVisible = false;
  }

  // Confirma el modal
  handleOk() {
    this.isVisible = false;
  }
}
