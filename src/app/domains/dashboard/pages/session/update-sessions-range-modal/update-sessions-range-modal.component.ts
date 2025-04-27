import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InstructorModel } from '@shared/models/instructor.model';
import { SessionModel } from '@shared/models/session.model';
import { InstructorService } from '@shared/services/instructor.service';
import { SessionService } from '@shared/services/program/session.service';
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

@Component({
  selector: 'app-update-sessions-range-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzDatePickerModule, NzTimePickerModule, NzInputModule,NzSelectModule, NzModalModule, NzFormModule, NzLayoutModule,NzButtonModule],
  templateUrl: './update-sessions-range-modal.component.html',
  styleUrl: './update-sessions-range-modal.component.css'
})
export class UpdateSessionsRangeModalComponent {

    @Input() sessionId!: number;

    @Input() rapId!: number;
    @Input() courseId!: number;
    @Output() updateConfirmed = new EventEmitter<void>();
    @Output() sessionCreated = new EventEmitter<SessionModel>();
    @Output() sessionsUpdatedByRange = new EventEmitter<SessionModel[]>();

    get fieldStartTime(): FormControl {
      return this.sessionForm.get('start_time') as FormControl;
    }
    get fieldEndTime(): FormControl {
      return this.sessionForm.get('end_time') as FormControl;
    }
    get fieldStartDate(): FormControl {
      return this.sessionForm.get('start_date') as FormControl;
    }
    get fieldEndDate(): FormControl {
      return this.sessionForm.get('end_date') as FormControl;
    }
    get fieldDayOfWeek(): FormControl {
      return this.sessionForm.get('new_day_of_week') as FormControl;
    }


    sessionForm!: FormGroup;
    loading = false;
    sessionData!: SessionModel;
    isVisible = false;
    defaultOpenValue = new Date(1970, 0, 1, 0, 0);
    instructors: any[] = [];

    private notification = inject(NzNotificationService);
    private submitSubject = new Subject<void>();

    public dayOptions = [
      { value: 1, label: 'Lunes' },
      { value: 2, label: 'Martes' },
      { value: 3, label: 'Miércoles' },
      { value: 4, label: 'Jueves' },
      { value: 5, label: 'Viernes' },
      { value: 6, label: 'Sábado' },
      { value: 7, label: 'Domingo' }
    ];

    constructor(
      private cd: ChangeDetectorRef,

      private fb: FormBuilder,
      private sessionService: SessionService,
      private instructorService: InstructorService
    ) {}

    ngOnInit(): void {
      this.buildForm();
      this.submitSubject.pipe(debounceTime(1000)).subscribe(() => {
        this.submitForm();
      });
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['sessionId'] && changes['sessionId'].currentValue) {
        this.loadSessionData();
      }if (changes['sessionId'] && changes['sessionId'].currentValue) {
        this.loadSessionData();
      }
    }

    todisabledDate = (current: Date): boolean => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      console.log('Hoy es:', today);
      return current && current < today;
    };

    loadSessionData(): void {
      console.log('Llamando a loadSessionData con sessionId:', this.sessionId);
      this.loading = true;

      this.sessionService.getSessionShow(this.sessionId, {
        included: [
          'instructor',
          'instructor.user',
          'instructor.knowledgeNetwork',
          'rap',
          'rap.subject',
          'course',
          'course.program',
          ''
        ]
      }).subscribe({
        next: (res: SessionModel) => {
          console.log('Datos de sesión recibidos:', res);
          this.sessionData = res;
          this.populateForm();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error en loadSessionData:', err);
          this.loading = false;
        }
      });
    }

    populateForm(): void {

      const [year, month, day] = this.sessionData.date.split('-').map(Number);

      // Convertir el string de fecha a un objeto Date
      // const sessionDate = new Date(this.sessionData.date);
      const sessionDate = new Date(year, month - 1, day);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Convertir start_time y end_time a objetos Date con fecha base fija (1970-01-01)
      const [startHour, startMinute, startSecond] = this.sessionData.start_time.split(':');
      const startTimeDate = new Date(1970, 0, 1, Number(startHour), Number(startMinute), Number(startSecond));

      const [endHour, endMinute, endSecond] = this.sessionData.end_time.split(':');
      const endTimeDate = new Date(1970, 0, 1, Number(endHour), Number(endMinute), Number(endSecond));

      this.sessionForm.patchValue({
        network: this.sessionData.instructor?.knowledge_network?.name,
        instructor:this.sessionData.instructor?.id,
        // instructor: `${this.sessionData.instructor?.user?.name} ${this.sessionData.instructor?.user?.last_name}`,
        rap: this.sessionData.rap?.description,
        subject: this.sessionData.rap?.subject?.name,
        course: this.sessionData.course?.code,
        percentage: this.sessionData.rap?.subject?.percentage
      });

      this.cd.markForCheck();

      const networkId = this.sessionData.instructor?.knowledge_network?.id;
      if (networkId){
        this.loadInstructors(networkId);
      }

    }

    debounceSubmit(): void {
      this.submitSubject.next();
    }

    buildForm(): void {
      this.sessionForm = this.fb.group({
        start_date: [null, Validators.required],
        end_date: [null, Validators.required],
        network: [{ value: null, disabled: true }, Validators.required],
        instructor: [null, Validators.required],
        rap: [{ value: null, disabled: true }, Validators.required],
        subject: [{ value: null, disabled: true }, Validators.required],
        course: [{ value: null, disabled: true }, Validators.required],
        start_time: [null, Validators.required],
        end_time: [null, Validators.required],
        percentage: [{ value: null, disabled: true }, Validators.required],
        new_days_of_week: [[], [Validators.required, Validators.min(1), Validators.max(7)]],
        // confirmed: [false, Validators.requiredTrue]

      });
    }

    loadInstructors(networkId:number):void{
      this.instructorService.getInstructorByKnowledgeNetwork(networkId).subscribe({
        next: (instructors: InstructorModel[]) =>{
          this.instructors = instructors;
        },
        error:(err) =>{
          console.error('error  de carga de instructores por network', err);
        }
      })
    }

    openModal(): void {
      this.isVisible = true;
    }

    cancel(): void {
      this.isVisible = false;
    }

    submitForm(): void {
  console.log('submitForm invoked')
      if (this.sessionForm.invalid) {
        Object.keys(this.sessionForm.controls).forEach(control => {
          this.sessionForm.controls[control].markAsDirty();
          this.sessionForm.controls[control].updateValueAndValidity();
        });
        return;
      }

      const formValues = this.sessionForm.getRawValue();
      console.log('Valores del formulario:', formValues);


      const updatedSession = {
        start_date: this.convertDateToString(formValues.start_date),
        end_date:   this.convertDateToString(formValues.end_date),
        rap_id: this.rapId,
        course_id: this.courseId,
        start_time: this.convertTimeToString(formValues.start_time),
        end_time:   this.convertTimeToString(formValues.end_time),
        instructor_id: formValues.instructor,
        new_days_of_week: formValues.new_days_of_week,
        confirmed: true
      };
      console.log('Payload a enviar:', updatedSession);

      this.sessionService.updateSessionsByDateRAnge(updatedSession).subscribe({
        next: (response) => {
          console.log('Sesión actualizada:', response);
                this.sessionCreated.emit(response);
                this.createBasicNotification();
                this.loading = false;
                this.isVisible = false;
              },
              error: (err) => {
                let errorMessage = 'Error al actualizar la sesión.';
                if (err.error) {
                  if (err.error.message) {
                    errorMessage = err.error.message;
                  }
                  if (err.error.conflict_session) {
                    // errorMessage += ' Detalle del conflicto: ' + JSON.stringify(err.error.conflict_session);
                  }
                }
                this.notification.create('error', 'Error', errorMessage);
                this.loading = false;

              }
      });
    }

    private convertTimeToString(time: Date): string {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
     // const seconds = time.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    private convertDateToString(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    createBasicNotification(): void {

    }

  public loadSessionDataFromParent(sessionId: number): void {
    this.sessionId = sessionId;
    this.loadSessionData();
  }

}
