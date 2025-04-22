import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeleteRangeParams } from '@shared/dto/program/update-session-dto';
import { SessionService } from '@shared/services/program/session.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-delete-sessions-range-modal',
  standalone: true,
  imports: [NzModalModule, CommonModule, NzFormModule, NzDatePickerModule, ReactiveFormsModule, NzButtonModule],
  templateUrl: './delete-sessions-range-modal.component.html',
  styleUrl: './delete-sessions-range-modal.component.css'
})
export class DeleteSessionsRangeModalComponent implements OnDestroy{
  @Input() rapId!: number;
  @Input() courseId!: number;
  @Output() deleteConfirmed = new EventEmitter<void>();

  isVisible = false;
  rangeForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private datePipe: DatePipe,
    private notification: NzNotificationService
  ) {
    this.rangeForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });
  }

  open(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.rangeForm.reset();
  }
  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

  handleSubmit(): void {
    if (this.rangeForm.valid) {
      const formValue = this.rangeForm.value;
      
      const params: DeleteRangeParams = {
        start_date: this.formatDate(formValue.startDate),
        end_date: this.formatDate(formValue.endDate),
        rap_id: this.rapId,
        course_id: this.courseId
      };
  
      this.sessionService.deleteSessionsByDateRange(params)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.handleSuccess(),
          error: (err) => this.handleError(err)
        });
    }
  }

  // obtener solo la parte de la fecha
  private getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  // deshabilitar fechas de inicio
  disabledStartDate = (startDate: Date): boolean => {
    const today = this.getToday();
    const endDate = this.rangeForm?.get('endDate')?.value;

    // fecha de fin, además de hoy, se valida también que no sea después de endDate
    return (startDate && startDate < today) ||
      (endDate && startDate > new Date(endDate));
  };

  // deshabilitar fechas de fin
  disabledEndDate = (endDate: Date): boolean => {
    const today = this.getToday();
    const startDate = this.rangeForm?.get('startDate')?.value;

    return (endDate && endDate < today) ||
      (startDate && endDate < new Date(startDate));
  };

  private handleSuccess(): void {
    this.notification.success(
      'Éxito',
      'Sesiones eliminadas correctamente',
      { nzDuration: 3000 }
    );
    this.deleteConfirmed.emit();
    this.handleCancel();
  }

  private handleError(error: any): void {
    this.notification.error(
      'Error',
      'No se pudieron eliminar las sesiones',
      { nzDuration: 5000 }
    );
    console.error('Error deleting sessions:', error);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
}
