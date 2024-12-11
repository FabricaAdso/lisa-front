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
import { ProgramModel } from '@shared/models/program.model';

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
    // locale: enLocale,
    events: [], // Inicialmente vacío
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.sessionService.getAll({included:['course.program','instructor','course','assistances.apprentice','course.environment']})
    .subscribe({
      next: (sessions) => {
        this.initialEvents = sessions;
        this.updateCalendarEvents(); // Actualiza los eventos del calendario
      },
      error: (err) => {
        console.error('Error loading sessions:', err);
      },
    });
  }

    // Obtiene el color para el timeline
    getTimelineColor(session: SessionModel): string {
      const today = new Date();
      const dateSesion = new Date(session.date)
      const hasAssistanceTaken =  session.assistances.length > 0;
  
      if (dateSesion === today) {
        return 'blue'; // Sesión actual
      }
    
      // 2. Gris: Si la sesión aún no ha ocurrido
      if (dateSesion > today) {
        return 'gray'; // Sesión futura
      }
      
      if (dateSesion< today && hasAssistanceTaken) {
        return 'green'; // Sesión pasada con al menos una asistencia tomada
      }
    
      // 4. Rojo: Si la sesión ya ocurrió pero no se tomó asistencia
      if (dateSesion < today && !hasAssistanceTaken) {
        return 'red'; // Sesión pasada sin asistencia tomada
      }
    
      // Por defecto (esto nunca debería ocurrir, pero es por seguridad)
      return 'gray';
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

  formatTimeWithoutSeconds(time: string): string {
    if (!time) return "Sin Asignar"; // Maneja valores nulos o indefinidos
    return time.split(':').slice(0, 2).join(':'); // Obtiene solo las horas y minutos
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
