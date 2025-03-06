import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargeExcelService } from '@shared/services/charge-excel.service';
import { NullEncryptedPrivateChannel } from 'laravel-echo/dist/channel';
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
import { lastValueFrom } from 'rxjs';

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
    NzTabsModule
  ],
  templateUrl: './charge-button.component.html',
  styleUrl: './charge-button.component.css'
})
export class ChargeButtonComponent implements OnInit {

  private messageService = inject(NzMessageService)
  private chargeExcelService = inject(ChargeExcelService)
  private notification = inject(NzNotificationService)

  isUploading = signal(false);
  isVisibleCargue= false

  selectedFile: { [key: string]: File | null } = {
    file_courses: null,
    file_apprentices: null,
    file_instructors: null,
  };

  ngOnInit(): void {
    this.isUploading()
  }

  formExcel = new FormGroup({
    file_courses: new FormControl('', [Validators.required]),
    file_apprentices: new FormControl('', [Validators.required]),
    file_instructors: new FormControl('', [Validators.required]),
  })

  get fieldFileExcelCourse() {
    return this.formExcel.get('file_courses') as FormControl;
  }
  get fieldFileExcelApprentices() {
    return this.formExcel.get('file_apprentices') as FormControl;
  }
  get fieldFileExcelInstructors() {
    return this.formExcel.get('file_instructors') as FormControl;
  }

  handleFileSelection(event: any, field: string) {
    const file = event.target.files[0];

    if (!file) {
      this.notification.create(
        'warning',
        'Advertencia',
        'No se ha seleccionado un archivo'
      )
    }

    this.selectedFile[field] = file;
  }

  // Función para iniciar la carga con defer
  async fileUpload() {
    if (!this.selectedFile['file_courses'] && 
        !this.selectedFile['file_apprentices'] && 
        !this.selectedFile['file_instructors']) {
      console.warn('No hay archivos seleccionados.');
      return;
    }

    this.isUploading.set(true); // Activa @defer

    
  try {
    const uploadPromises = [];

    for (const fileType of Object.keys(this.selectedFile)) {
      const file = this.selectedFile[fileType];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        let uploadService;
        if (fileType === 'file_courses') {
          uploadService = this.chargeExcelService.postExcelCourse(formData);
        } else if (fileType === 'file_apprentices') {
          uploadService = this.chargeExcelService.postExcelApprentices(formData);
        } else if (fileType === 'file_instructors') {
          uploadService = this.chargeExcelService.postExcelInstructors(formData);
        }

        if (uploadService) {
          uploadPromises.push(lastValueFrom(uploadService));
        }
      }
    }

    await Promise.all(uploadPromises);
    console.log('Todos los archivos fueron subidos con éxito');
  } catch (error) {
    console.error('Error en la carga de archivos', error);
  } finally {
    this.isUploading.set(false); // ✅ Desactivar la carga cuando el backend responda
    this.selectedFile = {}; // ✅ Ahora puede ser un objeto vacío

  }
  }

  handleCancel() {
    this.isVisibleCargue = false;
  }

  handleOk() {
    this.isVisibleCargue = false;
  }

}
