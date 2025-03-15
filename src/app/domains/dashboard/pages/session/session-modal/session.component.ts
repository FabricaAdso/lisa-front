import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
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
import { debounceTime, filter, forkJoin, of, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { CourseModel } from '@shared/models/course.model';
import { SessionModel } from '@shared/models/session.model';
import { CourseService } from '@shared/services/program/course.service';
import { SessionService } from '@shared/services/program/session.service';
import { CreateSessionDTO } from '@shared/dto/create-session.dto';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RapService } from '@shared/services/program/rap.service';
import { SubjectService } from '@shared/services/program/subject.service';
import { SubjectModel } from '@shared/models/subject-model';
import { RapModel } from '@shared/models/rap-model';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';


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
    NzModalContentDirective,
    NzInputNumberModule,
],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css',
})
export class SessionComponent implements OnInit, OnDestroy {

  @Input() isModalVisible = false;
  @Input() anotherModalOpen = false;
  @Output() sessionCreated = new EventEmitter<SessionModel>();

  time = new Date();

  private knowledge_network_service = inject(KnowledgeNetworkService);
  private instructor_service = inject(InstructorService);
  private formBuilder = inject(FormBuilder);
  private course_service = inject(CourseService);
  private session_service = inject(SessionService)
  private date_pipe = inject(DatePipe)
  private notification = inject(NzNotificationService);
  private rap_service = inject(RapService)
  private subject = inject(SubjectService)

  disableDates = () => true; // Desactiva todas las fechas

  // Campos de la base de datos
  start_date: string | null = null;

  start_time: string | null = null;
  end_time: string | null = null;




  selectedDate: Date | null = new Date();

  private subjectSelection = new Subject<void>();
  private knowledgeNetworkSelection = new Subject<void>();
  private destroy = new Subject<void>();
  private courseSelection = new Subject<void>();

  selectedId: number | null = null;
  formSession!: FormGroup | null;

  knowledge_network: KnowledgeNetworkModel[] = [];
  instructor: InstructorModel[] = [];
  courses: CourseModel[] = [];
  session: SessionModel[] = [];
  subjectList: SubjectModel[] = [];
  rapList: RapModel[] = [];
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

  openAnotherModal() {
    this.anotherModalOpen = true;
  }

  ngOnInit(): void {
    this.createForm()
    this.getData();
    this.changeKnowledgeNetwork();
    this.changeSubject();
    this.fieldCourse.valueChanges.subscribe((value) => {
      if (value) {
        this.fieldSubject.enable();
      } else {
        this.fieldSubject.disable();
        this.fieldSubject.reset();
        this.fieldRap.disable();
        this.fieldRap.reset();
      }
    });

    this.fieldSubject.valueChanges.subscribe((value) => {
      if (value) {
        this.fieldRap.enable();
      } else {
        this.fieldRap.disable();
        this.fieldRap.reset();
      }
    });

    this.fieldKnowledgeNetwork.valueChanges.subscribe((value) => {
      if (value) {
        this.fieldInstructor.enable();
        this.changeKnowledgeNetwork();
      } else {
        this.fieldInstructor.disable();
        this.fieldInstructor.reset();
      }
    });



  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.knowledgeNetworkSelection.next();
    this.knowledgeNetworkSelection.complete();
    this.courseSelection.next();
    this.courseSelection.complete();
  }


  getData() {
    forkJoin([
      this.knowledge_network_service
        .getknowledgeNetwork()
        .pipe(takeUntil(this.destroy)),
      this.course_service
        .getCourseLeader()
        .pipe(takeUntil(this.destroy)),
    ]).subscribe({
      next: ([knowledgeNetwork, courses,]) => {
        this.knowledge_network = [...knowledgeNetwork];
        this.courses = [...courses];

/*         this.courses = courses.filter(course =>course.state === 'En_ejecucion')
 */

},
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  };




  changeKnowledgeNetwork() {
    this.fieldKnowledgeNetwork.valueChanges
      .pipe(
        tap((value) => {
          console.log('Valor de knowledge_network:', value);

          this.knowledgeNetworkSelection.next();
          console.log(this.knowledgeNetworkSelection);

          this.instructor = [];
        }),

        filter((value): value is number => value !== null && value !== ''), // que no sea nulo ni vacío
        switchMap((knowledgeNetwork: number) => {
          this.fieldInstructor.reset();
          console.log(knowledgeNetwork);
          return this.instructor_service
            .getInstructorByKnowledgeNetwork(knowledgeNetwork)
            .pipe(
              takeUntil(this.knowledgeNetworkSelection),
              tap((instructor) => {
                if (instructor.length === 0) {
                  this.notification.create(
                    'warning',
                    'Error',
                    'No hay ningun instructor asociado a la red de conocimiento'
                  );
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

  changeSubject() {
    this.fieldSubject.valueChanges
      .pipe(
        tap(() => {
          this.rapList = [];
        }),
        filter((value): value is number => value !== null && value !== ''),
        switchMap((subject: number) => {
          this.fieldRap.reset();
          return this.rap_service.getRapBySubject(subject).pipe(
            takeUntil(this.destroy),
            tap((raps: RapModel[]) => {
              if (raps.length === 0) {
                this.notification.create(
                  'warning',
                  'Error',
                  'No hay ningún rap asociado a la competencia'
                );
              }
              this.rapList = raps;
            })
          );
        }),
        takeUntil(this.subjectList)
      )
      .subscribe({
        error: (err) => console.error('Error en changeSubject:', err)
      });
  }

  changecourse() {
    this.fieldCourse.valueChanges
      .pipe(
        startWith(this.fieldCourse.value),
        tap(() => {
          this.courseSelection.next();
          // reinicia la lista de subjects
          this.subjectList = [];
        }),
        filter((value): value is number => value !== null && value !== ''),
        switchMap((courseId: number) => {
          // reinicia el campo de subject
          this.fieldSubject.reset();
          //el objeto del curso seleccionado a partir del id
          const selectedCourse = this.courses.find(c => c.id === courseId);
          if (!selectedCourse || !selectedCourse.code) {
            // si no  encuentra, retonra un observable vacio
            return of([]);
          }
          // llama al servici enviando el codigo del curso
          return this.subject.getSubjectByCourse(selectedCourse.code.toString()).pipe(
            takeUntil(this.courseSelection),
            tap((subjects: SubjectModel[]) => {
              if (subjects.length === 0) {
                this.notification.create(
                  'warning',
                  'Error',
                  'No se encontraron subjects para este curso'
                );
              }
              // asigna directamente el array de subjects
              this.subjectList = subjects;
            })
          );
        }),
        takeUntil(this.destroy)
      )
      .subscribe({
        error: (err) => console.error('Error en changeCourse:', err)
      });
  }



  createForm() {
    this.formSession = this.formBuilder.group({
      knowledge_network: new FormControl('', Validators.required),
      instructor_id: new FormControl({value: '',disable:true}, Validators.required),
      course_id: new FormControl('', Validators.required),
      start_time: new FormControl(null, Validators.required),
      end_time: new FormControl(null, Validators.required),
/*       end_time: new FormControl(new Date(0, 0, 0, 0, 0, 0), Validators.required),
 */      start_date: new FormControl(new Date(), Validators.required),
      days_of_week: new FormControl([], Validators.required,),
      rap_id: new FormControl({value: '', disabled:true}, Validators.required,),
      subject_id: new FormControl({value: '',disabled:true}, Validators.required,),
      percentage: new FormControl('', Validators.required)
    });

  }
  get fieldKnowledgeNetwork() {
    return this.formSession?.get('knowledge_network') as FormControl;
  }
  get fieldInstructor() {
    return this.formSession?.get('instructor_id') as FormControl;
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
  get fieldRap() {
    return this.formSession?.get('rap_id') as FormControl;
  }
  get fieldSubject() {
    return this.formSession?.get('subject_id') as FormControl;
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

  onDateChange(selectedDate: Date | Date[] | null): void {
    let date: Date | null = null;
    if (selectedDate) {
      if (Array.isArray(selectedDate)) {
        date = selectedDate[0];
      } else {
        date = selectedDate;
      }
    }
    const start_date = date ? this.date_pipe.transform(date, 'yyyy/MM/dd') : null;
    this.formSession?.get('start_date')?.setValue(start_date);
  }


  saveForm() {
    if (this.formSession?.valid) {
      const session: CreateSessionDTO = this.formSession.value as CreateSessionDTO;

      // convertir days_of_week a cadena si es un array
      if (session.days_of_week && Array.isArray(session.days_of_week)) {
        session.days_of_week = session.days_of_week.join(',');
      }

      // convertir start_time a "HH:mm"
      if (session.start_time) {
        const startTime = new Date(session.start_time);
        const formattedStartTime = this.date_pipe.transform(startTime, 'HH:mm')?.trim();
        if (!formattedStartTime) {
          this.notification.create('error', 'Error', 'Hora de inicio inválida');
          return;
        }
        session.start_time = formattedStartTime;
      }
      if (session.end_time) {
        const endTime = new Date(session.end_time);
        const formattedEndTime = this.date_pipe.transform(endTime, 'HH:mm')?.trim();
        if (!formattedEndTime) {
          this.notification.create('error', 'Error', 'Hora de fin inválida');
          return;
        }
        session.end_time = formattedEndTime;
      }

      console.log('Payload de sesión:', session);

      this.session_service.createSession(session).subscribe({
        next: (data) => {
          const newSession: SessionModel = Array.isArray(data) ? data[0] : data;
// Cuando se crea la sesión
        this.sessionCreated.emit(newSession);
          this.createBasicNotification();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al crear la sesión:', err);
          this.notification.create('error', 'Error', 'No se pudo crear la sesión');
        }
      });
    } else {
      this.notification.create('warning', 'Error', 'Por favor, complete todos los campos');
    }
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
    if (!this.fieldKnowledgeNetwork.value) {
      this.fieldInstructor.disable();
      this.fieldInstructor.reset();
    } else {
      this.fieldInstructor.enable();
    }
  this.isModalVisible = true;
  }


defaultOpenValue = new Date(0, 0, 0, 0, 0);


}
