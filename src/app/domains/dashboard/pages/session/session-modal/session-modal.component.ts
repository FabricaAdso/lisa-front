import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import { InstructorModel } from '@shared/models/instructor.model';
import { KnowledgeNetworkModel } from '@shared/models/knowledg-network.model';
import { InstructorService } from '@shared/services/instructor.service';
import { KnowledgeNetworkService } from '@shared/services/knowledge-network.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalComponent, NzModalContentDirective } from 'ng-zorro-antd/modal';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { debounceTime, distinctUntilChanged, filter, forkJoin, of, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { CourseModel } from '@shared/models/course.model';
import { SessionModel } from '@shared/models/session.model';
import { CourseService } from '@shared/services/course.service';
import { SessionService } from '@shared/services/session.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RapService } from '@shared/services/rap.service';
import { SubjectService } from '@shared/services/subject.service';
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
    NzInputNumberModule,
  ],
  templateUrl: './session-modal.component.html',
  styleUrl: './session-modal.component.css',
})
export class SessionModalComponent implements OnInit, OnDestroy {
  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current < today;
  }

  @Input() isModalVisible = false;
  @Input() anotherModalOpen = false;
  @Output() sessionCreated = new EventEmitter<SessionModel>();

  private createSubject = new Subject<void>();

  time = new Date();

  private knowledge_network_service = inject(KnowledgeNetworkService);
  private instructor_service = inject(InstructorService);
  private formBuilder = inject(FormBuilder);
  private course_service = inject(CourseService);
  private session_service = inject(SessionService);
  private date_pipe = inject(DatePipe);
  private notification = inject(NzNotificationService);
  private rap_service = inject(RapService);
  private subject = inject(SubjectService);

  disableDates = () => true; // Desactiva todas las fechas

  // Campos de la base de datos
  start_date: string | null = null;
  start_time: string | null = null;
  end_time: string | null = null;

  selectedDate: Date | null = new Date();

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


  constructor() { }

  openAnotherModal() {
    this.anotherModalOpen = true;
  }

  ngOnInit(): void {
    this.createForm();
    this.getData();
    this.setupFormSubscriptions();
    this.createSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.saveForm();
    });
    //
  }

  debounceSaveForm(): void {
    this.createSubject.next();
  }

  setupFormSubscriptions(): void {
    // Cuando cambia el course, habilita el subject o lo deshabilita
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

    // Cuando cambia el subject, habilita el rap y asigna el porcentaje
    this.fieldSubject.valueChanges.subscribe((value) => {
      if (value) {
        this.fieldRap.enable();
        const selectedSubject = this.subjectList.find(subj => subj.id === value);
        if (selectedSubject) {
          this.formSession!.get('percentage')?.setValue(selectedSubject.percentage, { emitEvent: false });
        }
      } else {
        this.fieldRap.disable();
        this.fieldRap.reset();
        this.formSession!.get('percentage')?.reset();
      }
    });

    // Solo controlar el estado del control de instructor (habilitar/deshabilitar) sin invocar la llamada HTTP
    this.fieldKnowledgeNetwork.valueChanges.subscribe((value) => {
      if (value) {
        this.fieldInstructor.enable();
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
      next: ([knowledgeNetwork, courses]) => {
        this.knowledge_network = [...knowledgeNetwork];
        this.courses = [...courses];
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  // Configura la suscripción para obtener los instructores según la red de conocimiento
  changeKnowledgeNetwork() {
    this.fieldKnowledgeNetwork.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((value) => {
          console.log('Valor de knowledge_network:', value);
          // Reinicia la lista de instructores
          this.instructor = [];
          // Se utiliza knowledgeNetworkSelection para cancelar suscripciones anteriores
          this.knowledgeNetworkSelection.next();
        }),
        filter((value): value is number => value !== null && value !== ''),
        switchMap((knowledgeNetwork: number) => {
          this.fieldInstructor.reset();
          return this.instructor_service
            .getInstructorByKnowledgeNetwork(knowledgeNetwork)
            .pipe(
              takeUntil(this.knowledgeNetworkSelection),
              tap((instructors) => {
                if (instructors.length === 0) {
                  this.notification.create(
                    'warning',
                    'Error',
                    'No hay ningún instructor asociado a la red de conocimiento'
                  );
                }
                // Actualiza la lista de instructores
                this.instructor = [...instructors];
              })
            );
        }),
        takeUntil(this.destroy)
      )
      .subscribe({
        error: (err) =>
          console.error('Error al obtener los instructores:', err),
      });
  }

  // Configura la suscripción para obtener los rap según el subject seleccionado
  changeSubject() {
    this.fieldSubject.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
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
        takeUntil(this.destroy)
      )
      .subscribe({
        error: (err) => console.error('Error en changeSubject:', err)
      });
  }

  // Configura la suscripción para obtener los subjects según el curso seleccionado
  changecourse() {
    this.fieldCourse.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith(this.fieldCourse.value),
        tap(() => {
          this.courseSelection.next();
          this.subjectList = [];
        }),
        filter((value): value is number => value !== null && value !== ''),
        switchMap((courseId: number) => {
          this.fieldSubject.reset();
          const selectedCourse = this.courses.find(c => c.id === courseId);
          if (!selectedCourse || !selectedCourse.code) {
            return of([]);
          }
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
      instructor_id: new FormControl({ value: '', disabled: true }, Validators.required),
      course_id: new FormControl('', Validators.required),
      start_time: new FormControl(null, Validators.required),
      end_time: new FormControl(null, Validators.required),
      start_date: new FormControl(new Date(), Validators.required),
      days_of_week: new FormControl([], Validators.required),
      rap_id: new FormControl({ value: '', disabled: true }, Validators.required),
      subject_id: new FormControl({ value: '', disabled: true }, Validators.required),
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
      const formattedTime = timeStart.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      this.fieldStartTime.setValue(timeStart);
      console.log('Hora seleccionada:', formattedTime);
    }
  }

  onTimeChangesEnd(timeEnd: Date): void {
    if (timeEnd) {
      const formattedTime = timeEnd.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      this.fieldEndTime.setValue(timeEnd);
      console.log('Hora seleccionada:', formattedTime);
    }
  }

  onDateChange(selectedDate: Date | Date[] | null): void {
    let date: Date | null = null;
    if (selectedDate) {
      date = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate;
    }
    const start_date = date ? this.date_pipe.transform(date, 'yyyy/MM/dd') : null;
    this.formSession?.get('start_date')?.setValue(start_date);
  }

  saveForm() {
    if (this.formSession?.valid) {
      const formValues = { ...this.formSession.value };

      // Procesa el campo start_time sin afectar el control original
      if (formValues.start_time) {
        const startTime = new Date(formValues.start_time);
        if (isNaN(startTime.getTime())) {
          this.notification.create('error', 'Error', 'Hora de inicio inválida');
          return;
        }
        const formattedStartTime = this.date_pipe.transform(startTime, 'HH:mm');
        if (!formattedStartTime) {
          this.notification.create('error', 'Error', 'Hora de inicio inválida');
          return;
        }
        formValues.start_time = formattedStartTime.trim();
      }

      // Procesa el campo end_time de manera similar
      if (formValues.end_time) {
        const endTime = new Date(formValues.end_time);
        if (isNaN(endTime.getTime())) {
          this.notification.create('error', 'Error', 'Hora de fin inválida');
          return;
        }
        const formattedEndTime = this.date_pipe.transform(endTime, 'HH:mm');
        if (!formattedEndTime) {
          this.notification.create('error', 'Error', 'Hora de fin inválida');
          return;
        }
        formValues.end_time = formattedEndTime.trim();
      }


      // Convierto el array days_of_week a string
      if (formValues.days_of_week && Array.isArray(formValues.days_of_week)) {
        formValues.days_of_week = formValues.days_of_week.join(',');
      }

      console.log('Payload de sesión:', formValues);

      this.session_service.createSession(formValues).subscribe({
        next: (data) => {
          const newSession: SessionModel = Array.isArray(data) ? data[0] : data;
          this.sessionCreated.emit(newSession);
          this.createBasicNotification();
          this.closeModal();
        },
        error: (err) => {
          let errorMessage = 'Error al crear la sesión.';
          if (err.error) {
            if (err.error.message) {
              errorMessage = err.error.message;
            }
            if (err.error.conflict_session) {
              errorMessage += ' Detalle del conflicto: ' + JSON.stringify(err.error.conflict_session);
            }
          }
          this.notification.create('error', 'Error', errorMessage);
        }
      });
    }
  }

  createBasicNotification(): void {
    this.notification.blank(
      'Se ha creado la sesión correctamente',
      'Ahora puede tomar asistencia de su sesión'
    );
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.formSession?.reset();
  }

  openModal() {
    // Recrea el formulario y sus suscripciones
    this.createForm();
    this.setupFormSubscriptions();

    // Carga nuevamente datos maestros
    this.getData();

    // Configura las suscripciones para llamadas HTTP
    this.changeKnowledgeNetwork();
    this.changeSubject();
    this.changecourse();

    // Habilita o deshabilita el campo instructor según el valor actual
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
