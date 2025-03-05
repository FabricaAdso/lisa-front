import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargeExcelService } from '@shared/services/charge-excel.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationComponent, NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-charge-button',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzTableModule,
    NzDividerModule,
    NzSelectModule,
    NzIconModule,
    NzInputModule,
    NzPaginationModule,
    NzUploadModule,
    NzTabsModule,
    NzFormControlComponent
  ],
  templateUrl: './charge-button.component.html',
  styleUrl: './charge-button.component.css'
})
export class ChargeButtonComponent {

  private messageService = inject(NzMessageService)
  private chargeExcelService = inject(ChargeExcelService)
  private notification = inject(NzNotificationService)

  isVisibleCargue = false;

  formExcel = new FormGroup({
    file: new FormControl('', [Validators.required]),
  })

  get fieldFileExcel() {
    return this.formExcel.get('file') as FormControl;
  }

  handleFileUpload(event: any) {
    const file = event.file.originFileObj;

    if (!file) {
      this.notification.create(
        'error',
        'Error',
        'No se ha seleccionado un archivo'
      )
    }

    // Crear FormData y agregar el archivo
    const formData = new FormData();
    formData.append('file', file); // El nombre debe coincidir con el backend

    this.chargeExcelService.postExcel(formData).subscribe({
      next: (response: any) => {
        console.log('Respuesta del backend:', response);
      },
      error: (error) => {
        console.error('Error en la carga:', error);
      }
    });

  }

  handleCancel() {
    this.isVisibleCargue = false;
  }

  handleOk() {
    this.isVisibleCargue = false;
  }

}
