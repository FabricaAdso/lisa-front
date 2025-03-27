import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { sessionupdatepartialDto, UpdateSessionDto } from '@shared/dto/program/update-session-dto';
import { InstructorModel } from '@shared/models/instructor.model';
import { SessionModel } from '@shared/models/session.model';
import { InstructorService } from '@shared/services/instructor.service';
import { SessionService } from '@shared/services/program/session.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'app-session-edit',
  standalone: true,
  imports: [NzModalModule, NzFormModule, ReactiveFormsModule, CommonModule, NzDatePickerModule, NzTimePickerModule, NzButtonModule, NzInputModule, NzLayoutModule, NzSelectModule],
  templateUrl: './session-edit.component.html',
  styleUrl: './session-edit.component.css'
})
export class SessionEditComponent implements OnInit, OnChanges {
  @Input() sessionId!: number;
  sessionForm!: FormGroup;
  loading = false;
  sessionData!: SessionModel;
  isVisible = false;

  defaultOpenValue = new Date(1970, 0, 1, 0, 0);


  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current < today;
  };

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sessionId'] && changes['sessionId'].currentValue) {
      this.loadSessionData();
    }
  }

  buildForm(): void {
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
        'date'
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
    // Convertir el string de fecha a un objeto Date
    const sessionDate = new Date(this.sessionData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Convertir start_time y end_time a objetos Date con fecha base fija (1970-01-01)
    const [startHour, startMinute, startSecond] = this.sessionData.start_time.split(':');
    const startTimeDate = new Date(1970, 0, 1, Number(startHour), Number(startMinute), Number(startSecond));

    const [endHour, endMinute, endSecond] = this.sessionData.end_time.split(':');
    const endTimeDate = new Date(1970, 0, 1, Number(endHour), Number(endMinute), Number(endSecond));

    this.sessionForm.patchValue({
      date: sessionDate,
      network: this.sessionData.instructor?.knowledge_network?.name,
      instructor:this.sessionData.instructor?.id,
      // instructor: `${this.sessionData.instructor?.user?.name} ${this.sessionData.instructor?.user?.last_name}`,
      rap: this.sessionData.rap?.description,
      subject: this.sessionData.rap?.subject?.name,
      course: this.sessionData.course?.code,
      start_time: startTimeDate,
      end_time: endTimeDate,
      percentage: this.sessionData.rap?.subject?.percentage
    });


    const networkId = this.sessionData.instructor?.knowledge_network?.id;
    if (networkId){
      this.loadInstructors(networkId);
    }





    if (sessionDate < today) {
      this.sessionForm.disable();
      // Opcional: mostrar un mensaje de aviso
      console.warn('Esta sesión es pasada y no se puede editar.');
    }
  }


  instructors: any[] = [];


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




  // Método simplificado para enviar solo los campos editables usando PUT
  submitForm(): void {
    if (this.sessionForm.invalid) {
      Object.keys(this.sessionForm.controls).forEach(control => {
        this.sessionForm.controls[control].markAsDirty();
        this.sessionForm.controls[control].updateValueAndValidity();
      });
      return;
    }

    const formValues = this.sessionForm.getRawValue();

    const updatedSession = {
      id: this.sessionData.id,
      start_date: this.convertDateToString(formValues.date),
      start_time: this.convertTimeToString(formValues.start_time),
      end_time: this.convertTimeToString(formValues.end_time),
      // instructor_id: this.sessionData.instructor?.id
      instructor_id: formValues.instructor
    };

    this.sessionService.updateSession(updatedSession).subscribe({
      next: (response) => {
        console.log('Sesión actualizada:', response);
              this.sessionCreated.emit(response);

              this.isVisible = false;
            },
      error: (err) => {
        console.error('Error al actualizar la sesión:', err);
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

  // Getters opcionales para facilitar el acceso a controles (opcional)
  get fieldStartTime(): FormControl {
    return this.sessionForm.get('start_time') as FormControl;
  }
  get fieldEndTime(): FormControl {
    return this.sessionForm.get('end_time') as FormControl;
  }
  get fieldDate(): FormControl {
    return this.sessionForm.get('date') as FormControl;
  }

  @Output() sessionCreated = new EventEmitter<SessionModel>();



}
