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

import { CalendarEvent, SessionModel } from '@shared/models/session.model';
import { SessionService } from '@shared/services/program/session.service';
import { QueryUrl } from '@shared/models/query-url.model';

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
    events: [] as CalendarEvent[],
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    const queryParams: QueryUrl = {
      included: [
        'instructor.user',
        'course',
        'course.program',
        'assistances.apprentice.user',
        'course.environment'
      ]
    };

    this.sessionService.getSessionByMount(queryParams).subscribe({
      next: (resp: { [month: string]: SessionModel[] }) => {
        const dailyEvents: CalendarEvent[] = [];


        Object.keys(resp).forEach((month: string) => {
          const sessions: SessionModel[] = resp[month];

          const sessionsByDay = sessions.reduce(
            (acc: { [day: string]: SessionModel[] }, session: SessionModel): { [day: string]: SessionModel[] } => {
              const day: string = session.date;
              if (!acc[day]) {
                acc[day] = [];
              }
              acc[day].push(session);
              return acc;
            },
            {} as { [day: string]: SessionModel[] }
          );

          Object.keys(sessionsByDay).forEach((day: string) => {
            dailyEvents.push({
              title: `${sessionsByDay[day].length} Sesión${sessionsByDay[day].length > 1 ? 'es' : ''}`,
              start: `${day}T00:00:00`,
              description: `${sessionsByDay[day].length} sesiones programadas`,
              extendedProps: { sessions: sessionsByDay[day] },
              display: 'block'
            });
          });
        });

        this.calendarOptions.events = dailyEvents;
      },
      error: (err: any) => console.error(err)
    });
  }





  // Obtiene el color para el timeline
  getTimelineColor(session: SessionModel): string {
    console.log(session);
    const today = new Date();
    const dateSesion = new Date(session.date);
    // Usa un arreglo vacío si session.assistances es undefined
    const hasAssistanceTaken = (session.assistances || []).length > 0;

    // Se compara la fecha ignorando la hora
    if (dateSesion.toDateString() === today.toDateString()) {
      return 'blue'; // Sesión actual
    }
    if (dateSesion > today) {
      return 'gray'; // Sesión futura
    }
    if (dateSesion < today && hasAssistanceTaken) {
      return 'green'; // Sesión pasada con asistencia
    }
    if (dateSesion < today && !hasAssistanceTaken) {
      return 'red'; // Sesión pasada sin asistencia
    }
    return 'gray';
  }


  // Maneja el clic en un evento para mostrar el modal
  handleEventClick(clickInfo: EventClickArg): void {
    const eventDate = clickInfo.event.startStr.split('T')[0];
  console.log('Datos de sesiones en extendedProps:', clickInfo.event.extendedProps['sessions']);

    // Accede a las sesiones usando la notación de corchetes
    const sessionsForDay: SessionModel[] = clickInfo.event.extendedProps['sessions'] || [];

    this.selectedEvent = {
      title: `Sesiones del día ${eventDate}`,
      sessions: sessionsForDay,
    };

    this.isVisible = true;
  }


  // Obtiene las sesiones para una fecha específica
  getSessionsForDay(date: string): SessionModel[] {
    return this.initialEvents.filter((event: SessionModel) => event.date === date);
  }

  // Método alternativo de agrupación de sesiones (si se requiere en otro contexto)
  getGroupedSessions(): CalendarEvent[] {
    const groupedEvents: { [key: string]: number } = {};

    this.initialEvents.forEach((event: SessionModel) => {
      groupedEvents[event.date] = (groupedEvents[event.date] || 0) + 1;
    });

    return Object.keys(groupedEvents).map((date: string) => ({
      title: `${groupedEvents[date]} Sesión${groupedEvents[date] !== 1 ? 'es' : ''}`,
      start: `${date}T00:00:00`,
      description: `${groupedEvents[date]} sesiones programadas`,
      extendedProps: { sessions: this.initialEvents.filter((event: SessionModel) => event.date === date) },
      display: 'block',
    }));
  }

  formatTimeWithoutSeconds(time: string): string {
    if (!time) return "Sin Asignar"; // Maneja valores nulos o indefinidos
    return time.split(':').slice(0, 2).join(':'); // Obtiene solo horas y minutos
  }

  // Oculta el modal
  handleCancel(): void {
    this.isVisible = false;
  }

  // Confirma el modal
  handleOk(): void {
    this.isVisible = false;
  }
}
