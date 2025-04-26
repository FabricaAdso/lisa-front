import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeleteRangeParams } from '@shared/dto/program/update-session-dto';
import { SessionService } from '@shared/services/session.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-delete-sessions-range-modal',
  standalone: true,
  imports: [NzModalModule, CommonModule, NzFormModule, NzDatePickerModule, ReactiveFormsModule, NzButtonModule],
  templateUrl: './delete-sessions-range-modal.component.html',
  styleUrl: './delete-sessions-range-modal.component.css'
})
export class DeleteSessionsRangeModalComponent implements OnDestroy {
  @Input() rapId!: number;          // ID de la RAP desde componente padre
  @Input() courseId!: number;       // ID del curso desde componente padre
  @Output() deleteConfirmed = new EventEmitter<void>(); // Evento al eliminar exitosamente

  isVisible = false;
  rangeForm: FormGroup;

  // PROPIEDADES PRIVADAS
  private destroy$ = new Subject<void>();

  // INICIALIZACIÓN
  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) {
    // Configuración inicial del formulario
    this.rangeForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });
  }

  // MÉTODOS DEL MODAL
  open(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.rangeForm.reset();
  }

  // MANEJO DE FECHAS
  // Formatea fechas a 'YYYY-MM-DD'
  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

  // Obtiene la fecha actual sin hora
  private getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  // Valida fechas deshabilitadas para fecha inicial
  disabledStartDate = (startDate: Date): boolean => {
    const today = this.getToday();
    const endDate = this.rangeForm?.get('endDate')?.value;

    // Deshabilita si es anterior a hoy o posterior a la fecha final seleccionada
    return (startDate && startDate < today) || (endDate && startDate > new Date(endDate));
  };

  // Valida fechas deshabilitadas para fecha final
  disabledEndDate = (endDate: Date): boolean => {
    const today = this.getToday();
    const startDate = this.rangeForm?.get('startDate')?.value;

    // Deshabilita si es anterior a hoy o anterior a la fecha inicial seleccionada
    return (endDate && endDate < today) || (startDate && endDate < new Date(startDate));
  };

  // ENVÍO DEL FORMULARIO
  handleSubmit(): void {
    if (!this.rangeForm.valid) return;
    const { startDate, endDate } = this.rangeForm.value;
    const params: DeleteRangeParams = {
      start_date: this.formatDate(startDate),
      end_date: this.formatDate(endDate),
      rap_id: this.rapId,
      course_id: this.courseId
    };
    // Abrir confirm dialog
    this.modal.confirm({
      nzTitle: '¿Estás seguro que quieres eliminar estas sesiones?',
      nzContent: `Se eliminarán las sesiones entre <strong>${params.start_date}</strong> y <strong>${params.end_date}</strong>. Esta acción no se puede deshacer.`,
      nzOkText: 'Sí, eliminar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => this.confirmDeleteRange(params)
    });
  }

  // MANEJO DE RESULTADOS
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
    // Notificación de error
    this.notification.error(
      'Error',
      'No se pudieron eliminar las sesiones',
      { nzDuration: 5000 }
    );
    console.error('Error eliminando sesiones:', error);
  }

  // Ciclo
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // manejar la llamada real de borrado
  private confirmDeleteRange(params: DeleteRangeParams): void {
    this.sessionService.deleteSessionsByDateRange(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleSuccess(),
        error: err => this.handleError(err)
      });
  }

}
