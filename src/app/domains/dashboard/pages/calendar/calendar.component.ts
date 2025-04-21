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
import { log } from 'ng-zorro-antd/core/logger';

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
    timeZone: 'local', // Asegura que se use la zona horaria local
    plugins: [interactionPlugin, dayGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    events: [] as CalendarEvent[],
    eventClick: this.handleEventClick.bind(this),
    datesSet: this.handleDatesSet.bind(this)  // Se ejecuta cada vez que cambia el rango de fechas visible

  };

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
  }


  loadSessions(month?: string): void {
    // Determinar el mes a utilizar:
    // Si se pasa un parámetro "month", se usa ese valor; si no, se toma el mes actual.
    const now = new Date();
    // Formateamos la fecha actual en "YYYY-MM" si no se recibe un mes
    const selectedMonth = month ? month : `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

    // Construir los parámetros de consulta
    // Se envía "month" como propiedad de primer nivel, no dentro de filter.
    const queryParams: QueryUrl = {
      month: selectedMonth,  // Se envia como: month=YYYY-MM
      included: [
        'instructor.user',
        'course',
        'course.program',
        'course.environment'
      ]
    };

    // petición a la API para obtener las sesiones del mes seleccionado
    this.sessionService.getSessionByMount(queryParams).subscribe({
      next: (resp: any) => {

        // resp.data es un objeto agrupado por mes,
        // Usamos Object.values() para obtener un array con los arrays de sesiones y flat() para aplanarlo.
        if(!resp?.data){
          console.log
          ("No hay datos para mostrar", resp);
          return;
        }
        const sessions: SessionModel[] = Object.values(resp.data).flat() as SessionModel[];

        // Agrupar las sesiones por día:
        // Se utiliza reduce() para recorrer el array de sesiones y crear un objeto donde
        // cada clave es una fecha (en formato "YYYY-MM-DD") y su valor es un array de sesiones.
        const sessionsByDay = sessions.reduce(
          (acc: { [day: string]: SessionModel[] }, session: SessionModel) => {
            const day = session.date;  // Session.date tiene el formato "YYYY-MM-DD"
            if (!acc[day]) {
              acc[day] = []; // Si no existe, inicializamos el array para ese día.
            }
            acc[day].push(session); // Agregamos la sesión al array correspondiente.
            return acc;
          },
          {} as { [day: string]: SessionModel[] }
        );

        // crear eventos para cada día:
        // Se itera sobre las claves del objeto sessionsByDay y se crea un objeto de tipo CalendarEvent
        // para cada día, que incluirá la cantidad de sesiones y su información.
        const dailyEvents: CalendarEvent[] = Object.keys(sessionsByDay).map((day: string) => ({
          title: `${sessionsByDay[day].length} Sesión${sessionsByDay[day].length > 1 ? 'es' : ''}`,
          start: `${day}T00:00:00`,  // Se establece la fecha del evento
          description: `${sessionsByDay[day].length} sesiones programadas`,
          extendedProps: { sessions: sessionsByDay[day] },  // Propiedad extendida para guardar las sesiones del día (para modal)
          display: 'block'
        }));

        // Actualizar la configuración del calendario:
        // Se asigna el array de eventos al calendario para que se rendericen.
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


  handleDatesSet(info: any): void {
    // Obtenemos el rango de fechas visible en la vista del calendario.
    // activeStart: primer día visible en la cuadrícula (puede incluir días de meses anteriores).
    // activeEnd: primer día no visible (marca el final del rango mostrado).
    const startDate: Date = info.view.activeStart;
    const endDate: Date = info.view.activeEnd;

    // Creamos un objeto para contar cuántos días de la vista pertenecen a cada mes.
    // La clave es una cadena en formato "YYYY-MM" y el valor es la cantidad de días de ese mes.
    const monthCounts: { [key: string]: number } = {};

    // 3. Empezamos desde el primer día visible (activeStart)
    let current = new Date(startDate);

    // Recorremos cada día en el rango visible hasta llegar a activeEnd.
    // Esto nos permite contar cuántos días corresponden a cada mes.
    while (current < endDate) {
      // Formateamos la fecha actual para obtener la clave "YYYY-MM"
      const key = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}`;
      // Incrementamos el contador para ese mes
      monthCounts[key] = (monthCounts[key] || 0) + 1;
      // Pasamos al siguiente día
      current.setDate(current.getDate() + 1);
    }

    // Determinamos cuál es el mes predominante (con mayor cantidad de días visibles)
    // Se recorre el objeto monthCounts y se elige la clave con el valor máximo.
    const majorityMonth = Object.keys(monthCounts).reduce((prev, curr) =>
      monthCounts[curr] > monthCounts[prev] ? curr : prev
    );

    console.log("Mes predominante detectado:", majorityMonth);

    // Llamamos a la función loadSessions pasando el mes predominante
    // para que cargue las sesiones correspondientes a ese mes.
    this.loadSessions(majorityMonth);
  }


}
