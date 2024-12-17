import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InstructorModel } from '@shared/models/instructor.model';
import {
  KnowledgeNetworkModel,
} from '@shared/models/knowledg-network.model';
import { InstructorService } from '@shared/services/instructor.service';
import { KnowledgeNetworkService } from '@shared/services/knowledge-network.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalComponent, NzModalContentDirective } from 'ng-zorro-antd/modal';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { filter, forkJoin, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { CourseModel } from '@shared/models/course.model';
import { SessionModel } from '@shared/models/session.model';
import { CourseService } from '@shared/services/program/course.service';
import { SessionService } from '@shared/services/program/session.service';
import { CreateSessionDTO } from '@shared/dto/create-session.dto';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [
    NzDatePickerModule,
    NzModalContentDirective,
    ReactiveFormsModule,
    NzOptionComponent,
    CommonModule,
    NzInputModule,
    NzSelectComponent,
    NzModalComponent,
    NzTimePickerModule,
    FormsModule,
    NzModalContentDirective
  ],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css',
})
export class SessionComponent implements OnInit, OnDestroy {

  @Input() isModalVisible = false;

  time = new Date();

  private knowledge_network_service = inject(KnowledgeNetworkService);
  private instructor_service = inject(InstructorService);
  private formBuilder = inject(FormBuilder);
  private course_service = inject(CourseService);
  private session_service = inject(SessionService)
  private date_pipe = inject(DatePipe)
  private notification = inject(NzNotificationService);

  disableDates = () => true; // Desactiva todas las fechas

  // Campos de la base de datos
  start_date: string | null = null;
  end_date: string | null = null;

  start_time: string | null = null;
  end_time: string | null = null;



  // Propiedad vinculada al rango del picker
  date = null;

  private knowledgeNetworkSelection = new Subject<void>();
  private destroy = new Subject<void>();

  selectedId: number | null = null;
  formSession!: FormGroup | null;
  formRangePicker!: FormGroup | null;

  knowledge_network: KnowledgeNetworkModel[] = [];
  instructor: InstructorModel[] = [];
  courses: CourseModel[] = [];
  session: SessionModel[] = [];
  day_of_week = [
    { id: 1, name: 'Lunes' },
    { id: 2, name: 'Martes' },
    { id: 3, name: 'Miércoles' },
    { id: 4, name: 'Jueves' },
    { id: 5, name: 'Viernes' },
    { id: 6, name: 'Sábado' },
    { id: 7, name: 'Domingo' }
  ];
  constructor() {
    
  }

  ngOnInit(): void {
    this.createForm()
    this.getData();
    this.changeKnowledgeNetwork();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.knowledgeNetworkSelection.next();
    this.knowledgeNetworkSelection.complete();
  }

  getData() {
    forkJoin([
      this.knowledge_network_service
        .getknowledgeNetwork()
        .pipe(takeUntil(this.destroy)),
      this.course_service
        .getCourses()
        .pipe(takeUntil(this.destroy))
    ]).subscribe({
      next: ([knowledgeNetwork, courses]) => {
        this.knowledge_network = [...knowledgeNetwork];
        this.courses = [...courses];
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  };

  changeKnowledgeNetwork() {
    this.fieldKnowledgeNetwork.valueChanges
      .pipe(
        tap(() => {
          this.knowledgeNetworkSelection.next();

          this.instructor = [];
        }),
        filter((value): value is number => value !== null),
        switchMap((knowledgeNetwork: number) => {
          this.fieldInstructor.reset();
          return this.instructor_service
            .getInstructorByKnowledgeNetwork(knowledgeNetwork)
            .pipe(
              takeUntil(this.knowledgeNetworkSelection),
              tap((instructor) => {
                if (instructor.length === 0) {
                  alert('no se econtraron instructores');
                }
                this.instructor = [
                  ...new Set([...this.instructor, ...instructor]),
                ];
              })
            );
        }),
        takeUntil(this.destroy)
      )
      .subscribe({
        error: (err) =>
          console.error('Error al obtener los centros de formación:', err),
      });
  }


  createForm() {
    this.formSession = this.formBuilder.group({
      knowledge_network: new FormControl('', Validators.required),
      instructor_id: new FormControl('', Validators.required),
      course_id: new FormControl('', Validators.required),
      start_time: new FormControl(new Date(0, 0, 0, 0, 0, 0), Validators.required),
      end_time: new FormControl(new Date(0, 0, 0, 0, 0, 0), Validators.required),
      start_date: new FormControl(new Date, Validators.required),
      end_date: new FormControl(new Date, Validators.required),
      days_of_week: new FormControl([], Validators.required,),
    });
    this.formRangePicker = this.formBuilder.group({
      range_picker: new FormControl('', Validators.required)
    });
  }
  get fieldKnowledgeNetwork() {
    return this.formSession?.get('knowledge_network') as FormControl;
  }
  get fieldInstructor() {
    return this.formSession?.get('instructor_id') as FormControl;
  }
  get fieldRangePicker() {
    return this.formRangePicker?.get('range_picker') as FormControl;
  }
  get fieldCourse() {
    return this.formSession?.get('course_id') as FormControl;
  }
  get fieldDayOfWeek() {
    return this.formSession?.get('days_of_week') as FormControl;
  }
  get fieldStartTime() {
    return this.formSession?.get('start_time') as FormControl;
  }
  get fieldEndTime() {
    return this.formSession?.get('end_time') as FormControl;
  }

  onTimeChangesStart(timeStart: Date): void {
    if (timeStart) {
      // Formatear la hora en formato HH:mm
      const formattedTime = timeStart.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      console.log('Hora seleccionada:', formattedTime); // Ejemplo: '21:02'

    }
  }

  onTimeChangesEnd(timeEnd: Date): void {
    if (timeEnd) {
      // Formatear la hora en formato HH:mm
      const formattedTime = timeEnd.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      console.log('Hora seleccionada:', formattedTime); // Ejemplo: '21:02'

    }
  }

  onDateChange(dates: [Date | null, Date | null]): { start_date: string | null, end_date: string | null } {

    let start_date = null;
    let end_date = null;

    if (dates && dates.length === 2) {
      start_date = this.date_pipe.transform(dates[0], 'yyyy/MM/dd');
      end_date = this.date_pipe.transform(dates[1], 'yyyy/MM/dd');
    }
    this.formSession?.get('start_date')?.setValue(start_date)
    this.formSession?.get('end_date')?.setValue(end_date)

    console.log(this.formSession?.value)
    return { start_date, end_date }
  }


  saveForm() {

    const session: CreateSessionDTO = this.formSession?.value as CreateSessionDTO

    // Transformar el valor del campo day_of_week
    if (session.days_of_week && Array.isArray(session.days_of_week)) {
      session.days_of_week = session.days_of_week.join(',');
    }

    // Convertir las fechas a solo hora (HH:mm)
    if (session.start_time) {
      const startTime = new Date(session.start_time);
      session.start_time = startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }

    if (session.end_time) {
      const endTime = new Date(session.end_time);
      session.end_time = endTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }


    this.session_service.createSession(session).subscribe({
      next: (data) => {
        let session = [...this.session, data]
        this.createBasicNotification();
        this.closeModal()
      }
    })

  }

  createBasicNotification(): void {
    this.notification
      .blank(
        'Se ha creado la sesion correctamente',
        'Ahora puede tomar asistencia de su sesion'
      )
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.formSession?.reset();
  }

  openModal() {
    this.isModalVisible = true;
    console.log(this.isModalVisible);
    
  }
}
