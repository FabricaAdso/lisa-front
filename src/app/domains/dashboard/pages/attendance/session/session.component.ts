import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InstructorModel } from '@shared/models/instructor.model';
import {
  KnowledgeNetworkByInstructorModel,
  KnowledgeNetworkModel,
} from '@shared/models/knowledg-network.model';
import { InstructorService } from '@shared/services/instructor.service';
import { KnowledgeNetworkService } from '@shared/services/knowledge-network.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalComponent, NzModalContentDirective } from 'ng-zorro-antd/modal';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { filter, forkJoin, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { CourseModel } from '@shared/models/course.model';
import { SessionModel } from '@shared/models/session.model';
import { CourseService } from '@shared/services/program/course.service';
import { SessionService } from '@shared/services/program/session.service';
import { CreateSessionDTO } from '@shared/dto/create-session.dto';

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
    
  ],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css',
})
export class SessionComponent implements OnInit {

  time = new Date();

  private knowledge_network_service = inject(KnowledgeNetworkService);
  private instructor_service = inject(InstructorService);
  private formBuilder = inject(FormBuilder);
  private course_service = inject(CourseService);
  private session_service = inject(SessionService)

  disableDates = () => true; // Desactiva todas las fechas

  // Campos de la base de datos
  start_date: Date | null = null;
  end_date: Date | null = null;

  // Propiedad vinculada al rango del picker
  date: [Date | null, Date | null] = [null, null];

  private knowledgeNetworkSelection = new Subject<void>();
  private destroy = new Subject<void>();

  selectedId: number | null = null;
  isModalVisible = false;
  formSession!: FormGroup | null;

  knowledge_network: KnowledgeNetworkModel[] = [];
  instructor: InstructorModel[] = [];
  courses: CourseModel[] = [];
  day_of_week = [
    { id: 1, name: 'Lunes' },
    { id: 2, name: 'Martes' },
    { id: 3, name: 'Miércoles' },
    { id: 4, name: 'Jueves' },
    { id: 5, name: 'Viernes' },
    { id: 6, name: 'Sábado' },
    { id: 7, name: 'Domingo' }
  ];

  // Método para obtener los nombres de los días seleccionados
  getSelectedDayNames(): string[] {
    const selectedIds = this.formSession?.get('day_of_week')?.value || [];
    return selectedIds.map((id: number) => {
      const day = this.day_of_week.find(d => d.id === id);
      return day ? day.name : '';
    }).filter((name:any) => name !== ''); // Filtra valores vacios en caso de errores
  }


  ngOnInit(): void {
    this.createForm();
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
  }

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

  submitFormSession(){
    const selectedIds = this.fieldDayOfWeek.value;
    const dayNames = this.getSelectedDayNames();
    console.log('Días seleccionados (IDs):', selectedIds);
    console.log('Días seleccionados (nombres):', dayNames);
  }




  createForm() {
    this.formSession = this.formBuilder.group({
      knowledge_network: new FormControl('', Validators.required),
      instructor_id: new FormControl('', Validators.required),     
      course_id: new FormControl('', Validators.required),
      day_of_week: new FormControl([]),
    });
  }
  get fieldKnowledgeNetwork() {
    return this.formSession?.get('knowledge_network') as FormControl;
  }
  get fieldInstructor() {
    return this.formSession?.get('instructor_id') as FormControl;
  }
  get fieldRangePicker() {
    return this.formSession?.get('range_picker') as FormControl;
  }
  get fieldCourse() {
    return this.formSession?.get('course_id') as FormControl;
  }
  get fieldDayOfWeek(){
    return this.formSession?.get('day_of_week') as FormControl;
  }

  onDateChange(dates: [Date | null, Date | null]) {
    if (dates && dates.length === 2) {
      this.start_date = dates[0];
      this.end_date = dates[1];
    } else {
      this.start_date = null;
      this.end_date = null;
    }
    console.log('Start:', this.start_date, 'End:', this.end_date);

    // Aquí puedes enviar los valores a tu base de datos o procesarlos según sea necesario.
  }

  saveForm(){
    const instructor: CreateSessionDTO = this.formSession?.value as CreateSessionDTO

    this.session_service.createSession(instructor).subscribe
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.formSession?.reset();
  }

  openModal() {
    this.isModalVisible = true;
  }
}
