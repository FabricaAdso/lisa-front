import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EventClickArg } from '@fullcalendar/core/index.js';
import { SessionModel } from '@shared/models/session.model';
import { SessionService } from '@shared/services/program/session.service';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { AssistanceService } from '@shared/services/assistance.service';
import { AssistanceModel } from '@shared/models/assistance.model';

@Component({
  selector: 'app-calendar-apprentices',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    NzModalModule,
    NzButtonModule,
    NzTimelineModule,
  ],
  templateUrl: './calendar-apprentices.component.html',
  styleUrl: './calendar-apprentices.component.css'
})
export class CalendarApprenticesComponent {
  isVisible = false; // Estado del modal
  selectedEvent: { title: string; sessions: SessionModel[] } | null = null;
  assistance: AssistanceModel[] = [];


  // Sesiones iniciales con estado de asistencia
  initialEvents: SessionModel[] = [];
  assistanceEvents: AssistanceModel[] = [];

  // Opciones del calendario
  calendarOptions: any = {
    plugins: [interactionPlugin, dayGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    events: [], // Inicialmente vacío
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(private sessionService: SessionService, private assistanceService: AssistanceService) {}

  ngOnInit(): void {
    this.loadAssistances();
    this.loadSessions();
  }

  loadSessions(): void {
    this.sessionService.getAll({included:['course.program','instructor','course','assistances.apprentice']}).subscribe({
      next: (sessions) => {
        this.initialEvents = sessions;
        this.updateCalendarEvents(); // Actualiza los eventos del calendario
      },
      error: (err) => {
        console.error('Error loading sessions:', err);
      },
    });
  }

  loadAssistances() : void {
    this.assistanceService.getAssitanceAll({included:['apprentice','apprentice.user']})
    .subscribe({
      next: (assistances) => {
        this.assistanceEvents = assistances;
        },
        error: (err) => {
          console.error('Error loading assistances:', err);
          },
      });
  }

    // Obtiene el color para el timeline
    // Obtiene el color para el timeline
// Obtiene el color y el estado de la asistencia para el timeline
getTimelineColor(session: SessionModel): { color: string, status: string } {
  const assistance = this.assistanceEvents.find(
    (assistance) => assistance.session_id === session.id
  );

  if (assistance) {
    if (assistance.assistance) {
      return { color: 'green', status: 'Asistió' }; 
    } else {
      return { color: 'red', status: 'No asistió' }; 
    }
  }
  return { color: 'gray', status: 'Por asistir' };
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
