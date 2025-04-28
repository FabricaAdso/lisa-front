import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InstructorModel } from '@shared/models/instructor.model';
import { SessionModel } from '@shared/models/session.model';
import { InstructorService } from '@shared/services/instructor.service';
import { SessionService } from '@shared/services/session.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { debounceTime, Subject } from 'rxjs';
import { DeleteSessionsRangeModalComponent } from '../delete-sessions-range-modal/delete-sessions-range-modal.component';
import { NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { UpdateSessionsRangeModalComponent } from "../update-sessions-range-modal/update-sessions-range-modal.component";

@Component({
  selector: 'app-session-edit',
  standalone: true,
  imports: [NzModalModule, NzFormModule, ReactiveFormsModule, CommonModule, NzDatePickerModule,
    NzTimePickerModule, NzButtonModule, NzInputModule, NzLayoutModule, NzSelectModule,
    NzDropDownModule, NzIconModule, NzMenuModule, ],
  templateUrl: './session-edit.component.html',
  styleUrl: './session-edit.component.css'
})
export class SessionEditComponent implements OnInit, OnChanges {
  // DECORADORES Y EVENTOS
  @Input() sessionId!: number;           // ID de sesión recibido del componente padre
  @Output() sessionCreated = new EventEmitter<SessionModel>(); // Evento al actualizar sesión

  // FORMULARIO Y CONTROLES
  sessionForm!: FormGroup;
  get fieldDate(): FormControl {
    return this.sessionForm.get('date') as FormControl;
  }
  get fieldStartTime(): FormControl {
    return this.sessionForm.get('start_time') as FormControl;
  }
  get fieldEndTime(): FormControl {
    return this.sessionForm.get('end_time') as FormControl;
  }

  // ESTADO DEL COMPONENTE
  loading = false;
  isVisible = false;
  sessionData!: SessionModel;
  instructors: any[] = [];

  // SERVICIOS Y UTILIDADES
  private notification = inject(NzNotificationService);
  private readonly submitSubject = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private instructorService: InstructorService
  ) { }

  // CICLO DE VIDA
  ngOnInit(): void {
    this.buildForm();
    this.setupDebounceSubmit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sessionId']?.currentValue) {
      this.loadSessionData();
    }
  }

  // INICIALIZACIÓN DE FORMULARIO
  private buildForm(): void {
    this.sessionForm = this.fb.group({
      date: [null, Validators.required],
      network: [{ value: null, disabled: true }, Validators.required],
      instructor: [null, Validators.required],
      rap: [{ value: null, disabled: true }, Validators.required],
      subject: [{ value: null, disabled: true }, Validators.required],
      course: [{ value: null, disabled: true }, Validators.required],
      start_time: [null, Validators.required],
      end_time: [null, Validators.required],
      percentage: [{ value: null, disabled: true }, Validators.required]
    });
  }

  // CARGA DE DATOS
  private loadSessionData(): void {
    console.log('Cargando datos para sesión ID:', this.sessionId);
    this.loading = true;

    this.sessionService.getSessionShow(this.sessionId, {
      included: [ // Relaciones necesarias para mostrar datos completos
        'instructor',
        'instructor.user',
        'instructor.knowledgeNetwork',
        'rap',
        'rap.subject',
        'course',
        'course.program',
        'date'
      ]
    }).subscribe({
      next: (res: SessionModel) => this.handleSessionData(res),
      error: (err) => this.handleDataError(err)
    });
  }

  private handleSessionData(res: SessionModel): void {
    this.sessionData = res;             // Almacena sesión
    this.populateForm();                // Rellena el formulario con los datos
    this.loadNetworkInstructors();      // Carga instructores de la misma red
    this.loading = false;
  }

  private handleDataError(err: any): void {
    console.error('Error cargando datos:', err);
    this.loading = false;
    this.notification.error('Error', 'No se pudieron cargar los datos de la sesión');
  }

  // RELLENAR FORMULARIO
  private populateForm(): void {
    const sessionDate = this.parseSessionDate(); // Parsea fecha de la sesión
    const [startTimeDate, endTimeDate] = this.parseSessionTimes(); // Parsea horas

    this.sessionForm.patchValue({
      date: sessionDate,
      network: this.sessionData.instructor?.knowledge_network?.name,
      instructor: this.sessionData.instructor?.id,
      rap: this.sessionData.rap?.description,
      subject: this.sessionData.rap?.subject?.name,
      course: this.sessionData.course?.code,
      start_time: startTimeDate,
      end_time: endTimeDate,
      percentage: this.sessionData.rap?.subject?.percentage
    });
  }

  // MANEJO DE FECHAS Y HORAS
  private parseSessionDate(): Date {
    const [year, month, day] = this.sessionData.date.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private parseSessionTimes(): [Date, Date] {
    return [
      this.parseTimeString(this.sessionData.start_time),
      this.parseTimeString(this.sessionData.end_time)
    ];
  }

  private parseTimeString(time: string): Date {
    const [hours, minutes, seconds] = time.split(':');
    return new Date(1970, 0, 1, +hours, +minutes, +seconds);
  }

  // CARGA DE INSTRUCTORES
  private loadNetworkInstructors(): void {
    const networkId = this.sessionData.instructor?.knowledge_network?.id;
    if (!networkId) return;

    this.instructorService.getInstructorByKnowledgeNetwork(networkId).subscribe({
      next: (instructors: InstructorModel[]) => this.instructors = instructors,
      error: (err) => console.error('Error cargando instructores:', err)
    });
  }

  // ENVÍO DEL FORMULARIO
  debounceSubmit(): void {
    this.submitSubject.next();          // Dispara el subject para debounce
  }

  private setupDebounceSubmit(): void {
    this.submitSubject.pipe(
      debounceTime(1000)                // Espera 1 segundo entre envíos
    ).subscribe(() => this.submitForm());
  }

  submitForm(): void {
    if (this.sessionForm.invalid) {
      this.markFormAsDirty();           // Marca controles como dirty si es inválido
      return;
    }

    this.loading = true;
    const updatedSession = this.prepareUpdatePayload(); // Prepara datos para actualizar

    this.sessionService.updateSession(updatedSession).subscribe({
      next: (response) => this.handleUpdateSuccess(response),
      error: (err) => this.handleUpdateError(err)
    });
  }

  private prepareUpdatePayload(): any {
    const formValues = this.sessionForm.getRawValue();
    return {
      id: this.sessionData.id,
      start_date: this.convertDateToString(formValues.date),
      start_time: this.convertTimeToString(formValues.start_time),
      end_time: this.convertTimeToString(formValues.end_time),
      instructor_id: formValues.instructor
    };
  }

  private markFormAsDirty(): void {
    Object.values(this.sessionForm.controls).forEach(control => {
      control.markAsDirty();            // Marca todos los controles como modificados
      control.updateValueAndValidity(); // Forza validación
    });
  }

  // HELPERS DE CONVERSIÓN
  private convertTimeToString(time: Date): string {
    return time.toTimeString().slice(0, 5); // Formato HH:mm
  }

  private convertDateToString(date: Date): string {
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  // MANEJO DE UI
  openModal(): void {
    this.isVisible = true;
  }

  cancel(): void {
    this.isVisible = false;
    this.sessionForm.reset();
  }

  // VALIDACIÓN DE FECHAS
  todisabledDate = (current: Date): boolean => {
    return current && current < new Date(new Date().setHours(0, 0, 0, 0)); // Fechas pasadas
  };

  // NOTIFICACIONES
  private createBasicNotification(): void {
    this.notification.blank(
      'Actualización exitosa',
      'La sesión se actualizó correctamente'
    );
  }

  private handleUpdateSuccess(response: SessionModel): void {
    console.log('Sesión actualizada:', response);
    this.sessionCreated.emit(response); // Notifica al componente padre
    this.createBasicNotification();     // Muestra notificación
    this.isVisible = false;             // Cierra el modal
    this.loading = false;
  }

  private handleUpdateError(err: any): void {
    let errorMessage = 'Error al actualizar la sesión';
    if (err.error?.message) errorMessage = err.error.message;

    this.notification.error('Error', errorMessage);
    this.loading = false;
  }
}

